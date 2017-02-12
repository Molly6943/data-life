define(function(require, exports, module) {
    var navigationBar = api.require('navigationBar');
    var aMap = api && api.require('aMap');
    var map = require('U/map');
    var Http = require('U/http');
    var fs = api.require('fs');
    var directory = 'activity';
    // var winFrame = _g.getLS('winFrame');
    var UserInfo = _g.getLS('UserInfo');
    var result = [];

    var header = new Vue({
        el: '#header',
        template: _g.getTemplate('main/home-header-V'),
        data: {
            searchText: '',
            active: 0,
            title: '消息',
            isHome: 1,
            list: [
                '消息',
                '运动',
                '共享',
                '隐私',
            ]
        },
        ready: function() {
            var y = $('#header').offset().height + 45;
            var w = api.frameWidth;
            var fh = _g.getLS('footerHeight');
            var h = Number(api.frameHeight) - (Number(y));
            map.openMap(aMap, 0, y, w, h, 'activity-sport-frame');
        },
        methods: {
            isSearchInput: function() {
                api.sendEvent({
                    name: 'search-index-input',
                    extra: {
                        inputValue: this.searchText,
                    }
                });
            },
            onChangeListTap: function() {
                api.sendEvent({
                    name: 'message-changeShowList'
                });
            },
            onMenuTap: function() {
                var mnPopups = api.require('MNPopups');
                mnPopups.open({
                    rect: {
                        w: 125,
                        h: 91
                    },
                    position: {
                        x: api.winWidth - 17,
                        y: $('#header').offset().height
                    },
                    styles: {
                        mask: 'rgba(0,0,0,0.2)',
                        bg: '#343530',
                        cell: {
                            bg: {
                                normal: '#343530',
                                highlight: '#343530'
                            },
                            h: 40,
                            title: {
                                marginL: 40,
                                color: '#fff',
                                size: 14,
                            },
                            icon: {
                                marginL: 10,
                                w: 19,
                                h: 19,
                                corner: 2
                            }
                        },
                        pointer: {
                            size: 7,
                            xPercent: 90,
                            yPercent: 0,
                            orientation: 'downward'
                        }
                    },
                    datas: [{
                        title: '扫一扫',
                        icon: 'widget://image/common/scan.png'
                    }, {
                        title: '发布',
                        icon: 'widget://image/common/post-news.png'
                    }],
                    animation: true
                }, function(ret) {
                    if (ret.eventType == 'click') {
                        if (ret.index == 0) {
                            _g.openWin({
                                header: {
                                    data: {
                                        title: '扫一扫'
                                    },
                                    template: 'common/header-base-V'
                                },
                                name: 'scan-index',
                                url: '../scan/index.html',
                                bounces: false,
                                slidBackEnabled: false
                            });
                        } else if (ret.index == 2 || ret.index == 1) {
                            api.openFrame({
                                name: 'activity-index',
                                url: '../activity/index.html',
                                rect: {
                                    x: 0,
                                    y: 0,
                                    w: api.winWidth,
                                    h: api.winHeight
                                },
                                pageParam: {
                                    // name: 'test'
                                },
                                bounces: false,
                                bgColor: 'rgba(0,0,0,0)',
                                vScrollBarEnabled: false,
                                hScrollBarEnabled: false
                            });
                        }
                    }
                });
            },
            onSearchTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '',
                            rightText: '取消',
                            searchText: '',
                        },
                        template: 'main/search-header-V'
                    },
                    name: 'search-index',
                    url: '../search/index.html',
                    bounces: true,
                    slidBackEnabled: false,
                });
            }
        }
    });



    var sport = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/sport-main-V'),
        data: {
            isOpenFrame: false,
            oldBubbleId: 0,
            lon: 0,
            lat: 0,
            annotations: [{
                id: 1,
                lon: 113.399,
                lat: 19.127,
                icons:'',
                draggable: false,
                content: {
                    title: ' ',
                    subTitle: '求职',
                    illus: 'widget://image/activity/replaceImg.png'
                }
            }],
            // icons: ['widget://image/activity/activity-bmap-header.png', 'widget://image/activity/activity-bmap-header.png', 'widget://image/activity/activity-bmap-header.png', 'widget://image/activity/activity-bmap-header.png']
            icons: ['fs://tempa.jpg', 'fs://tempa.jpg', 'fs://tempa.jpg', 'fs://tempa.jpg', 'fs://tempa.jpg', 'fs://tempa.jpg', 'fs://tempa.jpg'],
        },
        ready: function() {

        },
        created: function() {
            this.icons = [];
        },
        methods: {

        },
    });

    function showMenu(data) {
        for (var i = 0; i < data.length; i++) {
            navigationBar.open({
                y: $('#header').offset().height,
                w: api.frameWidth,
                h: 45,
                itemSize: {
                    w: 63,
                    h: 30
                },
                items: [{
                    title: data[0].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[1].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[2].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[3].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[4].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[5].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[6].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[7].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[8].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[9].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[10].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[11].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[12].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[13].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[14].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }],
                font: {
                    size: 14,
                    sizeSelected: 14,
                    color: '#fff',
                    colorSelected: '#fff'
                },
                bg: '#38373C',
                fixedOn: api.frameName
            }, function(ret, err) {
                if(ret.eventType == 'click') {
                    _g.openWin({
                        header: {
                            data: {
                                title: '发布活动',
                                rightText:'发布'
                            },
                        },
                        name: 'activity-publish',
                        url: '../activity/publish.html',
                        bounces: true,
                        slidBackEnabled: false,
                        pageParam:{
                            selectedIndex: ret.index,
                            type1:1,
                        }
                    });
                }
            });
        }
    }

    function getType() {
        Http.ajax({
            data: {
                type: 2,
            },
            isSync: true,
            lock: false,
            url: '/system/info',
            success: function(ret) {
                if (ret.code == 200) {
                    showMenu(ret.data);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    getType()

    function getLocation() {
        aMap.getLocation(function(ret, err) {
            if (ret.status) {
                sport.lon = ret.lon;
                sport.lat = ret.lat;
                getData();
            } else {
                _g.toast('定位失败,请开启定位!');
            }
        });
    }

    getLocation();

    function getData() {
        Http.ajax({
            url: '/action/getNearBy',
            data: {
                userID: UserInfo.userID,
                lng: sport.lon,
                lat: sport.lat
            },
            isSync: true,
            lock: false,
            success: function(ret) {
                if (Number(ret.code) == 200) {
                    sport.annotations = machData(ret.data);
                    result = ret.data;
                    getHeader(ret.data);
                }
            },
            error: function(err) {}
        })
    }

    function machData(data) {
        return _.map(data, function(item, index) {
            return {
                id: item.actionID || '',
                lon: item.lng + index * 0.001 || 0,
                lat: item.lat - index * 0.001 || 0,
                icons:[''],
                draggable: false,
                content: {
                    title: ' ',
                    subTitle: item.content,
                    illus: 'widget://image/activity/replaceImg.png'
                }
            }
        });
    }

    function getHeader(data) {
        _.each(data, function(n, i) {
            // sport.icons.push('widget://image/activity/activity-bmap-header.png');
            api.sendEvent({
                name: 'do-download-headImg',
                extra: {
                    url: n.user.avatar.replace('jpg', 'png'),
                    path: n.user.avatar.replace('jpg', 'png'),
                    host: CONFIG.HOST,
                    index:i
                }
            });
        });
        // if (sport.icons.length == result.length) {
        //     showMap();
        // }
    }

    function showMap() {
        map.getUserLocation(aMap);
        map.setTrajectoryPoint(aMap, sport.annotations, sport.icons);
        map.setBubble(aMap, sport.annotations, 'sport');
    }

    api.addEventListener({
        name: 'activity-refresh-map'
    }, function(ret, err) {
        getLocation()
    });
    api.addEventListener({
        name: 'activity-DownDone-addArr'
    }, function(ret, err) {
        sport.icons.push(ret.value.url);
        sport.annotations[ret.value.index]['icons'][0] = ret.value.url;
        if (sport.icons.length == result.length) {
            showMap();
        }
    });

    api.addEventListener({
        name: 'map-open-frame'
    }, function(ret, err) {
        if (sport.isOpenFrame == false) {
            sport.isOpenFrame = true;
            api.openFrame({
                name: 'activity-detail-frame',
                url: '../../html/activity/detail.html',
                rect: {
                    x: 0,
                    y: Number($('#header').height() + 45),
                    w: api.frameWidth,
                    h: Number(api.frameHeight) - (Number($('#header').height() + 45))
                },
                bounces: false,
                bgColor: 'rgba(0,0,0,0)',
                vScrollBarEnabled: true,
                hScrollBarEnabled: true,
                pageParam: {
                    actionID: ret.value.actionID,
                }
            });
        } else {
            api.bringFrameToFront({
                from: 'activity-detail-frame',
            });
        }
    });

    api.addEventListener({
        name: 'activity-detail-closeFrame'
    }, function(ret, err) {
        sport.isOpenFrame = false;
    });

    module.exports = {};

});
