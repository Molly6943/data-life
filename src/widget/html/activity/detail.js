define(function(require, exports, module) {

    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var aMap = api.require('aMap');
    var map = require('U/map');
    var directory = 'activity';
    var actionID = api.pageParam.actionID;
    var joinAction = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/detail-main-V'),
        data: {
            end: false,
            showImage: true,
            isGiveMoney: false,
            isGetMoney: false,
            userID: 0,
            avatar: '',
            nickName: '',
            startTime: '',
            endTime: '',
            content: '',
            thinks:'',
            address: '',
            XSMoney: '',
            DSMoney: '',
            QSMoney: '',
            DJMoney: '',
            images: [],
            starLon: 0,
            starLat: 0,
            endLon: 0,
            endLat: 0,
            distance: '',
        },
        methods: {
            onCloseFrameTap: function() {
                api.sendEvent({
                    name: 'activity-detail-closeFrame'
                })
                api.closeFrame();
            },
            onCloseTap: function() {
                joinAction.showImage = false;
            },
            onJoinTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: joinAction.nickName,
                        },
                        // template: 'main/barMenu-header-V'
                    },
                    pageParam: {
                        actionID: actionID,
                    },
                    name: 'privacy-taskDetail',
                    url: '../privacy/taskDetail.html',
                    bounces: true,
                    slidBackEnabled: false,
                });
                // api.closeFrame();
            }
        },
        ready: function() {

        }
    });

    var deviceModel = api.deviceModel;
    var a = 'iPad'+' '+'mini'+' '+'4';
    var b = 'iPhone'+' '+'4';
    if(deviceModel == a || deviceModel == b){
        joinAction.showImage = false;
    }else {
         joinAction.showImage = true;
    }

    function getData() {
        Http.ajax({
            data: {
                actionID: actionID,
            },
            isSync: true,
            lock: false,
            url: '/action/getActionDetail',
            success: function(ret) {
                if (ret.code == 200) {
                    var data = ret.data;
                    joinAction.userID = data.userInfo.userID || 0;
                    joinAction.avatar = CONFIG.HOST + data.userInfo.avatar || '';
                    joinAction.nickName = data.userInfo.name || '';
                    // joinAction.startTime = data.startTime ? data.startTime.slice(10, 16) : '';
                    // joinAction.endTime = data.endTime ? data.endTime.slice(10, 16) : '';
                    joinAction.content = data.content || '';
                    joinAction.thinks = data.thinks || '';
                    joinAction.address = data.address.addr || '';
                    joinAction.XSMoney = data.XSMoney || '0';
                    joinAction.DSMoney = data.DSMoney || '0';
                    joinAction.QSMoney = data.QSMoney || '0';
                    joinAction.DJMoney = data.DJMoney || '0';
                    joinAction.images = data.images || [];
                    joinAction.endLon = data.lng || 0;
                    joinAction.endLat = data.lat || 0;
                    //时间戳转日期时间
                    var start = new Date(data.startTime).Format('hh:mm');
                    joinAction.startTime = start;
                    var end = new Date(data.endTime).Format('hh:mm');
                    joinAction.endTime = end;
                    //判断是否展示悬赏打赏
                    if (joinAction.XSMoney == '0' && joinAction.DSMoney == '0' && joinAction.QSMoney == '0' && joinAction.DJMoney == '0') {
                        joinAction.isGetMoney = false;
                        joinAction.isGiveMoney = false;
                    } else if (joinAction.XSMoney != '0' || joinAction.DSMoney != '0') {
                        joinAction.isGiveMoney = true;
                        joinAction.isGetMoney = false;
                    } else if (joinAction.QSMoney != '0' || joinAction.DJMoney != '0') {
                        joinAction.isGetMoney = true;
                        joinAction.isGiveMoney = false;
                    }
                    //判断活动是否结束
                    var nowTime = new Date();
                    var nowDate = Date.parse(nowTime);
                    var endDate = joinAction.endTime;
                    if (endDate <= nowDate) {
                        joinAction.end = true;
                    } else {
                        joinAction.end = false;
                    }
                    getLocation();
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function getLocation() {
        map.openMap(aMap, api.winWidth, 0, 1, 1);
        aMap.getLocation(function(ret, err) {
            if (ret.status) {
                joinAction.starLon = ret.lon;
                joinAction.starLat = ret.lat;
                getDistance();
            } else {
                _g.toast('定位失败,请开启定位!');
            }
        });
    }



    function getDistance() {
        aMap.getDistance({
            start: {
                lon: joinAction.starLon,
                lat: joinAction.starLat
            },
            end: {
                lon: joinAction.endLon,
                lat: joinAction.endLat
            }
        }, function(ret, err) {
            if (ret.status) {
                if (ret.distance == 0) {
                    joinAction.distance = ret.distance + '米';
                } else if (ret.distance > 0) {
                    var needDistance = ret.distance / 1000;
                    if (needDistance >= 1) {
                        joinAction.distance = parseInt(needDistance) + '公里';
                    } else {
                        joinAction.distance = ret.distance + '米';
                    }
                }
            } else {

            }
        });
    }
    getData();
});
