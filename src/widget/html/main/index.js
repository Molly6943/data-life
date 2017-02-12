define(function(require, exports, module) {
    api.removeLaunchView();

    var headerHeight = 0;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var aMap = api.require('aMap');
    var fs = api.require('fs');
    var Http = require('U/http');
    var temp = '';
    var oldBubbleId = 0;
    var bubbleIsShow = false;
    var mainFrameList = [
        'index',
        'ask',
        'me'
    ];
    var province = [];
    var city = [];

    var footer = new Vue({
        el: '#footer',
        template: _g.getTemplate('main/footer-V'),
        data: {
            active: 0,
            list: [{
                title: '消息',
                tag: 'message'
            }, {
                title: '活动',
                tag: 'function'
            }, {
                title: '共享',
                tag: 'sharing'
            }, {
                title: '隐私',
                tag: 'privacy'
            }]
        },
        methods: {
            onItemTap: function(index) {
                api.setFrameGroupAttr({
                    name: 'message-group',
                    hidden: true
                });
                api.closeFrame({
                    name: 'activity-detail-frame',
                });
                api.sendEvent({
                    name: 'activity-detail-closeFrame'
                });
                if (this.active == index && index != 0) return;
                if (index == 0 || index == 1) {
                    if (index == 1) {
                            // 删除文件夹
                            fs.rmdir({
                                path: 'fs://temp'
                            }, function(ret, err) {

                            });
                            fs.rmdir({
                                path: 'fs://download'
                            }, function(ret, err) {

                            });
                            api.sendEvent({
                                name: 'activity-refresh-map'
                            })
                    } else if (index == 0) {
                        api.setFrameGroupAttr({
                            name: 'message-group',
                            hidden: false
                        });
                        api.sendEvent({
                            name: 'message-index-Frame'
                        });
                    }
                } else if (index == 2) {
                } else if (index == 3) {
                }
                this.active = index;
                api.setFrameAttr({
                    name: 'me-index-frame',
                    hidden: true
                });
                setFrameGroupIndex(index);
            },
        }
    });
    // var winFrame = {
    // 'headerHeight': $('#header').offset().height,
    //     'footerHeight': $('#footer').height(),
    // }
    _g.setLS('footerHeight', $('#footer').height());


    setTimeout(function() {
        openFrameGroup()
    }, 0);

    function openFrameGroup() {
        // headerHeight = $('#header').offset().height;
        footerHeight = $('#footer').height();

        api && api.openFrameGroup({
            name: 'main-group',
            scrollEnabled: false,
            rect: {
                x: 0,
                y: 0,
                w: 'auto',
                h: windowHeight - footerHeight
            },
            index: 0,
            preload: 0,
            frames: [{
                name: 'message-index-frame',
                url: '../message/index.html',
                bounces: false,
                bgColor: '#ededed',
            }, {
                name: 'activity-sport-frame',
                url: '../activity/sport.html',
                bounces: false,
                bgColor: '#ededed',
            }, {
                name: 'sharing-square-frame',
                url: '../sharing/square.html',
                bounces: false,
                bgColor: '#ededed',
            }, {
                name: 'privacy-index-frame',
                url: '../privacy/index.html',
                bounces: true,
                bgColor: '#ededed',
            }]
        }, function(ret, err) {
            footer.active = ret.index;
        });
    }

    function setFrameGroupIndex(index) {
        api && api.setFrameGroupIndex({
            name: 'main-group',
            index: index,
            scroll: false
        });
    }

    // function setBubble(id) {
    //     if (oldBubbleId != id) {
    //         if (oldBubbleId != id) {
    //             oldBubbleId = id;
    //         }
    //         aMap.setBubble({
    //             id: id,
    //             bgImg: 'widget://res/bubble_bg.png',
    //             content: {
    //                 title: '大标题',
    //                 subTitle: '概述内容',
    //                 illus: 'http://ico.ooopic.com/ajax/iconpng/?id=145044.png'
    //             },
    //             styles: {
    //                 titleColor: '#000',
    //                 titleSize: 16,
    //                 subTitleColor: '#999',
    //                 subTitleSize: 12,
    //                 illusAlign: 'left'
    //             }
    //         }, function(ret) {
    //             if (ret) {
    //                 bubbleIsShow = true;
    //                 aMap.popupBubble({
    //                     id: id
    //                 });
    //             }
    //         });
    //     }
    // }

    function getRegion() {
        Http.ajax({
            data: {},
            isSync: true,
            lock: false,
            url: '/user/getRegions',
            success: function(ret) {
                if (ret.code == 200) {
                    matchRegion(ret.data.region);
                    _g.setLS('Region', province);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function matchRegion(data) {
        _.each(data, function(n, i) {
            city = [];
            _.each(data, function(m, j) {
                if (m.pid == n.id) {
                    var cityObj = {
                        name: data[j].name,
                        // id: data[i].id
                    }
                    city.push(cityObj);
                }
            });
            if (n.pid == 1) {
                var provinceObj = {};
                provinceObj = {
                    name: data[i].name,
                    sub: city,
                    // id: data[i].id
                }
                province.push(provinceObj);
            }
        });
    }
    if (!_g.getLS('Region')) {
        getRegion();
    }

    //刷新main消息页
    api.addEventListener({
        name: 'main-index-message'
    }, function(ret, err) {
        footer.onItemTap(0);
        api.sendEvent({
            name: 'message-index-Frame'
        })
    });
    //刷新main消息页
    api.addEventListener({
        name: 'main-index-mine'
    }, function(ret, err) {
        footer.onItemTap(0);
        api.sendEvent({
            name: 'message-index-mineFrame'
        })
    });
    // 页面打开完成
    api && api.addEventListener({
        name: 'viewappear'
    }, function(ret, err) {
        _g.closeWins(['account-system-win']);
    });

    // 监听安卓返回按钮事件
    api && api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        api.closeWidget();
    });

    module.exports = {};

});
