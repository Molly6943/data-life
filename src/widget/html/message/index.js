define(function(require, exports, module) {

    var directory = 'message';
    var Http = require('U/http');


    var header = new Vue({
        el: '#header',
        template: _g.getTemplate('main/home-header-V'),
        data: {
            active: 0,
            title: '消息',
            isHome: 1,
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

    var index = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/index-main-V'),
        data: {
            active: 3,
            options: [{
                barText: '',
                id: 0
            }],
        },
        ready: function() {
            setTimeout(function() {
                $('body').css('padding-top', $('#header').height() - 1 + 'px');
            }, 0)
        },
        created: function() {

        },
        methods: {
            onBarTap: function(index) {
                if (this.active == index) return;
                if (index == 3) {
                    this.active = index;
                    setFrameGroupIndex(0);
                    api.sendEvent({
                        name: 'message-index-refreshFrame'
                    })
                } else if (index == 1 || index == 2 || index == 4) {
                    this.active = index;
                    api.setFrameAttr({
                        name: 'message-mine-frame'
                    })
                    setFrameGroupIndex(1);

                    api.execScript({
                        name: 'main-index-win',
                        frameName: 'message-mine-frame',
                        script: 'changeData(' + index + ')'
                    });
                } else if (index == 5) {
                    this.active = index;
                    setFrameGroupIndex(2);
                    api.sendEvent({
                        name: 'message-vslist-refreshFrame',
                        extra: {
                            type: 5
                        }
                    })
                }
            },
        },
    });

    setTimeout(function() {
        openFrameGroup()
    }, 0);

    function openFrameGroup() {
        var headerHeight = $('#header').height();
        var barHeight = $('.ui-bar').height();

        api && api.openFrameGroup({
            name: 'message-group',
            scrollEnabled: false,
            rect: {
                x: 0,
                y: headerHeight + barHeight,
                w: 'auto',
                h: api.frameHeight - (headerHeight + barHeight)
            },
            index: 0,
            preload: 1,
            frames: [{
                name: 'message-market-frame',
                url: '../message/market.html?mod=dev',
                bounces: true,
                bgColor: '#ededed',
                preload: 0,
            }, {
                name: 'message-mine-frame',
                url: '../message/mine.html?mod=dev',
                bounces: true,
                bgColor: '#ededed',
                preload: 0,
            }, {
                name: 'message-vslist-frame',
                url: '../message/vslist.html',
                bounces: true,
                bgColor: '#ededed',
                preload: 0,
            }]
        }, function(ret, err) {
            // footer.active = ret.index;
        });
    }

    function setFrameGroupIndex(index) {
        api && api.setFrameGroupIndex({
            name: 'message-group',
            index: index,
            scroll: false
        });
    }

    function getType() {
        Http.ajax({
            data: {
                type: 1,
            },
            isSync: true,
            lock: false,
            url: '/system/info',
            success: function(ret) {
                if (ret.code == 200) {
                    index.options = machType(ret.data);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function machType(data) {
        return _.map(data, function(item) {
            return {
                barText: item.name,
                id: item.id
            }
        });
    }
    getType();
    api.addEventListener({
        name: 'message-index-Frame'
    }, function(ret, err) {
        index.active = 3;
        setFrameGroupIndex(0);
        getType();
    });
    api.addEventListener({
        name: 'message-index-mineFrame'
    }, function(ret, err) {
        index.active = 2;
        setFrameGroupIndex(1);
        getType();
    })

});
