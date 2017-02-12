define(function(require, exports, module) {
    var aMap = api.require('aMap');
    var map = require('U/map');
    var fs = api.require('fs');
    var directory = 'privacy';
    var wgtRootDir = api.wgtRootDir;
    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');

    var trajectory = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/trajectory-main-V'),
        data: {
            fd: '1',
            trajectoryList: [{
                id: 1,
                lon: 113.399,
                lat: 23.127,
                icons: [],
                content: {
                    // title: '开心',
                    subTitle: '15：00',
                    illus: ''
                }
            }],
            lineList: [{
                lon: 113.399,
                lat: 23.127
            }],
            center: [{
                lon: 0,
                lat: 0,
            }],
        },
        created: function() {
            this.icons = [];
            this.lineList = [];
            this.trajectoryList = [];
        },
        methods: {},
    });

    function getLocation() {
        aMap.getLocation(function(ret, err) {
            if (ret.status) {
                trajectory.center.lon = ret.lon;
                trajectory.center.lat = ret.lat;
                showMap();
            } else {}
        });
    }

    function showMap() {
        map.openMap(aMap, 0, 64, api.frameWidth, api.frameHeight);
        setTimeout(function() {
            map.getUserLocation(aMap);
            map.setTrajectoryPoint(aMap, trajectory.trajectoryList, trajectory.icons);
            // map.setBubble(aMap, trajectory.trajectoryList, '');
            map.setLine(aMap, trajectory.lineList);
        }, 500);
    }

    showMap();

    function getData() {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
            },
            isSync: true,
            url: '/action/getActionSheet',
            success: function(ret) {
                if (ret.code == 200) {
                    trajectory.trajectoryList = machData(ret.data);
                    trajectory.lineList = machLineList(ret.data);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function machData(data) {
        return _.map(data, function(item) {
            return {
                id: 1,
                lon: item.lng,
                lat: item.lat,
                icons:['widget://image/privacy/trajectoryPoint.png'],
                content: {
                    subTitle: item.time.slice(10, 16),
                }
            }
        });
    }

    function machLineList(data) {
        return _.map(data, function(item) {
            return {
                id: 1,
                lon: item.lng,
                lat: item.lat,
            }
        });
    }

    getData();

    api.addEventListener({
        name: 'privacy-trajectory-actionSheet'
    }, function(ret, err) {
        api.actionSheet({
            cancelTitle: '取消',
            buttons: ['本年统计', '本季统计', '本周统计', '今天统计'],
            style: {
                layerColor: '', //遮蔽层颜色，仅支持 rgba颜色，默认值：rgba（0, 0, 0, 0.4）
                itemNormalColor: '#F0F0F0', //选项按钮正常状态背景颜色，支持#000、#000000、rgb、rgba，默认值：#F1F1F1
                itemPressColor: '#F0F0F0', //选项按钮按下时背景颜色，支持#000、#000000、rgb、rgba，默认值：#E6E6E6
                fontNormalColor: '#3D3D3D', //选项按钮正常状态文字颜色，支持#000、#000000、rgb、rgba，默认值：#007AFF
                fontPressColor: '#3D3D3D', //选项按钮按下时文字颜色，支持#000、#000000、rgb、rgba，默认值：#0060F0
                titleFontColor: '' //标题文字颜色，支持#000、#000000、rgb、rgba，默认值：#8F8F8F
            }
        }, function(ret, err) {
            if (ret.buttonIndex == 4) {
                _g.openWin({
                    header: {
                        data: {
                            title: '今天统计'
                        },
                    },
                    name: 'privacy-trace',
                    url: '../privacy/trace.html',
                    bounces: true,
                    slidBackEnabled: false
                });
            } else if (ret.buttonIndex == 1 || ret.buttonIndex == 2 || ret.buttonIndex == 3) {
                var title1 = '本年统计';
                var title2 = '本季统计';
                var title3 = '本周统计';
                var title = '';
                if(ret.buttonIndex == 1) {
                    title = title1;
                }else if(ret.buttonIndex == 2){
                    title = title2;
                }else if (ret.buttonIndex == 3) {
                    title = title3;
                }
                _g.openWin({
                    header: {
                        data: {
                            title: title
                        },
                    },
                    name: 'privacy-trajectoryTrack',
                    url: '../privacy/trajectoryTrack.html',
                    bounces: true,
                    slidBackEnabled: false,
                    pageParam:{
                        type:ret.buttonIndex,
                    }
                });
            }
        });
    });
});
