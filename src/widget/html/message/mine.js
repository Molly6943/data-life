define(function(require, exports, module) {
    var Http = require('U/http');
    var aMap = api.require('aMap');
    var map = require('U/map');
    var UserInfo = _g.getLS('UserInfo');
    var directory = 'message';
    var typeIndex = api.pageParam.typeIndex;
    var type;
    var collectType = api.pageParam.collectType;
    var id = api.pageParam.userID;
    var page = 1;
    var mine = new Vue({
        el: '#main',
        template: _g.getTemplate('message/mine-main-V'),
        data: {
            width: 0,
            list: [{
                showNow:true,
                showReady:false,
                showDone:false,
                userID: '',
                actionID: '',
                avatar: '',
                nickName: '',
                hobby: '',
                content: '',
                thinks:'',
                time: '',
                timeText: '',
                colNum: 0,
                cmtNum: 0,
                caiNum: 0,
                zanNum: 0,
                type: '',
                images: [],
                stars: [{
                    pic: '../../image/message/start2.png'
                }, {
                    pic: '../../image/message/start2.png'
                }, {
                    pic: '../../image/message/start2.png'
                }, {
                    pic: '../../image/message/start2.png'
                }, {
                    pic: '../../image/message/start2.png'
                }],
            }],
        },
        created: function() {

        },
        methods: {
            onDetailTap: function(event, index) {
                if($(event.target).hasClass('ui-list__head-avatar')) {
                    if(UserInfo.userID == mine.list[index].userID) {
                        _g.openWin({
                            header: {
                                data: {
                                    title: '我的首页'
                                }
                            },
                            name: 'privacy-index',
                            url: '../privacy/index.html',
                            bounces: false,
                            slidBackEnabled: false,
                            pageParam: {
                                userID: mine.list[index].userID,
                            }
                        });
                    }else {
                        _g.openWin({
                            header: {
                                data: {
                                    title: mine.list[index].nickName,
                                }
                            },
                            name: 'privacy-othersPage',
                            url: '../privacy/othersPage.html',
                            bounces: false,
                            slidBackEnabled: false,
                            pageParam: {
                                userID: mine.list[index].userID,
                            }
                        });
                    }
                }else {
                    _g.openWin({
                        header: {
                            data: {
                                title: mine.list[index].nickName,
                            }
                        },
                        name: 'message-detail',
                        url: '../message/detail.html',
                        pageParam: {
                            actionID: mine.list[index].actionID,
                            // actionID:id,
                        }
                    });
                }
            },
            onShareTap: function() {

            }
        },
    });

    function getMineList() {
        if (typeIndex == 2) {
            type = typeIndex;
        } else {
            type = type;
        }
        if (!type) return;
        Http.ajax({
            data: {
                page: page,
                type: type,
                userID: UserInfo.userID,
                lng: mine.lon,
                lat: mine.lat,
            },
            isSync: true,
            lock: false,
            url: '/action/getAction',
            success: function(ret) {
                if (ret.code == 200) {
                    setTimeout(function() {
                        if (ret.data.length == 0) {
                            _g.toast('没有更多了~');
                            window.isNoMore = true;
                        }
                        if (page == 1) {
                            mine.list = machMineList(ret.data)
                        } else {
                            mine.list = mine.list.concat(machMineList(ret.data));
                        }
                    }, 0);
                } else {
                    // _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function changeValue(value) {
        switch (Number(value)) {
            case 1:
                return "餐饮";
                break;
            case 2:
                return "运动";
                break;
            case 3:
                return "衣着";
                break;
            case 4:
                return "娱乐";
                break;
            case 5:
                return "交通";
                break;
            case 6:
                return "住宿";
                break;
            case 7:
                return "工作";
                break;
            case 8:
                return "学习";
                break;
            case 9:
                return "购物";
                break;
            case 10:
                return "家务";
                break;
            case 11:
                return "社交";
                break;
            case 12:
                return "啪啪";
                break;
            case 13:
                return "亲子";
                break;
            case 14:
                return "睡觉";
                break;
            case 15:
                return "其他";
                break;
        }
    }

    function machMineList(data) {
        return _.map(data, function(item, index) {
            //展示多少颗星星
            var starPic = [];
            if (Number(item.avgEvaNum) == 0) {
                for (var i = 0; i < 5; i++) {
                    starPic.push({
                        'pic': '../../image/message/start2.png'
                    })
                }
            } else {
                for (var i = 0; i < 5; i++) {
                    if (i < item.avgEvaNum) {
                        starPic.push({
                            'pic': '../../image/message/index-star.png'
                        })
                    } else {
                        starPic.push({
                            'pic': '../../image/message/start2.png'
                        })
                    }
                }
            }
            //判断当前的活动是准备进行，还是正在进行，还是已经结束
            var nowTime = new Date();
            var nowDate = parseInt(Date.parse(nowTime));
            // var endDate = parseInt(Date.parse(data[index].endTime)/1000);
            // var startDate = parseInt(Date.parse(data[index].startTime)/1000);
            var endDate = data[index].endTime;
            var startDate = data[index].startTime;
            var needEnd = (nowDate - endDate);
            var needStart = (startDate - nowDate);
            if (needEnd >= 0) {
                showNow = false;
                showReady = false;
                showDone = true;
            } else if (needStart >= 0) {
                showNow = false;
                showReady = true;
                showDone = false;
            }else if (needEnd<0 && needStart<0) {
                showNow = true;
                showReady = false;
                showDone = false;
            }

            return {
                showNow:showNow,
                showReady:showReady,
                showDone:showDone,
                userID: item.user.userID,
                nickName: item.user.name,
                avatar: CONFIG.HOST + item.user.avatar,
                content: item.content,
                thinks:item.thinks,
                actionID: item.actionID,
                colNum: item.favNum,
                cmtNum: item.cmtNum,
                caiNum: item.caiNum,
                zanNum: item.zanNum,
                hobby: item.user.hobbies || '这个家伙很懒，什么都没写~',
                timeText: item.lastTime,
                images: item.images,
                type: changeValue(item.actType),
                stars: starPic,
            }
        });
    }

    function getCollectData() {
        Http.ajax({
            data: {
                collectType: collectType,
                page: page,
                userID: id,
            },
            isSync: true,
            lock: false,
            url: '/action/myCollect',
            success: function(ret) {
                if (ret.code == 200) {
                    setTimeout(function() {
                        if (ret.data.length == 0) {
                            _g.toast('没有更多了~');
                            window.isNoMore = true;
                        }
                        if (page == 1) {
                            mine.list = machCollectData(ret.data);
                        } else {
                            mine.list = mine.list.concat(machCollectData(ret.data));
                        }
                    }, 0);
                    // _g.toast(ret.msg);
                } else {}
            },
            error: function(err) {}
        });
    }

    function machCollectData(data) {
        return _.map(data, function(item,index) {
            var starPic = [];
            if (Number(item.starLevel) == 0) {
                for (var i = 0; i < 5; i++) {
                    starPic.push({
                        'pic': '../../image/message/start2.png'
                    })
                }
            } else {
                for (var i = 0; i < 5; i++) {
                    if (i < item.starLevel) {
                        starPic.push({
                            'pic': '../../image/message/index-star.png'
                        })
                    } else {
                        starPic.push({
                            'pic': '../../image/message/start2.png'
                        })
                    }
                }
            }

            //判断当前的活动是准备进行，还是正在进行，还是已经结束
            var nowTime = new Date();
            var nowDate = parseInt(Date.parse(nowTime));
            // var endDate = parseInt(Date.parse(data[index].endTime)/1000);
            // var startDate = parseInt(Date.parse(data[index].startTime)/1000);
            var endDate = data[index].endTime;
            var startDate = data[index].startTime;
            var needEnd = (nowDate - endDate);
            var needStart = (startDate - nowDate);
            var showNow;
            var showReady;
            var showDone;
            if (needEnd >= 0) {
                showNow = false;
                showReady = false;
                showDone = true;
            } else if (needStart >= 0) {
                showNow = false;
                showReady = true;
                showDone = false;
            }else if (needEnd<0 && needStart<0) {
                showNow = true;
                showReady = false;
                showDone = false;
            }
            return {
                showNow:showNow,
                showReady:showReady,
                showDone:showDone,
                userID: item.userID || '',
                nickName: item.name || '',
                avatar: CONFIG.HOST + item.avatar || '',
                content: item.content || '',
                actionID: item.id || '',
                colNum: item.favNum || 0,
                cmtNum: item.evaNum || 0,
                caiNum: item.caiNum || 0,
                zanNum: item.zanNum || 0,
                thinks:item.thinks || '',
                hobby: item.hobbies || '这个家伙很懒，什么都没写~',
                images: item.images || [],
                type: changeValue(item.playStatus),
                stars: starPic,
            }
        });
    }

    if (collectType == 5 || collectType == 6) {
        getCollectData();
    } else {
        getMineList();
    }

    function getLocation() {
        map.openMap(aMap, api.winWidth, 0, 1, 1);
        aMap.getLocation(function(ret, err) {
            if (ret.status) {
                mine.lon = ret.lon;
                mine.lat = ret.lat;
                getMineList();
            } else {
                _g.toast('获取定位失败！');
            }
        });
    }

    _g.setPullDownRefresh(function() {
        page = 1;
        if (collectType == 5|| collectType == 6) {
            getCollectData();
        } else {
            getMineList();
        }
    });
    _g.setLoadmore(function() {
        page++;
        if (collectType == 5|| collectType == 6) {
            getCollectData();
        } else {
            getMineList();
        }
    });

    //拿到点击的类型,改变页数
    window.changeData = function(_type){
        page = 1;
        mine.list = [];
        window.isNoMore = false;
        type = _type;
        getLocation();
    }
});
