define(function(require, exports, module) {
    var UserInfo = _g.getLS('UserInfo');
    var Sign = _g.getLS('Sign');
    var userID = UserInfo.userID;
    var signArr = [];
    var directory = 'privacy';
    var Http = require('U/http');
    var mine = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/index-main-V'),
        data: {
            avatar: '../../image/privacy/icon-avatar.png',
            account: '',
            nickName: '',
            progress: '',
            sex: '',
            signIn: false
        },
        created: function() {

        },
        methods: {
            onSigninTap: function() {
                Http.ajax({
                    data: {},
                    lock: false,
                    isSync: true,
                    url: '/user/signIn',
                    success: function(ret) {
                        if (ret.code == 200) {
                            mine.signIn = true;
                            var userID = UserInfo.userID;
                            if(signArr.length>0) {
                                _.each(signArr,function(item,index) {
                                    if(userID != item.id) {
                                        var signObj = {
                                            id:userID,
                                            isSign:mine.signIn
                                        }
                                        signArr.push(signObj);
                                    }else {
                                        _g.toast('已经签过到了');
                                    }
                                });
                            }else {
                                var signObj = {
                                    id:userID,
                                    isSign:mine.signIn
                                }
                                signArr.push(signObj);
                            }
                            _g.setLS('Sign', signArr);
                            _g.toast(ret.msg);
                        } else {
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {}
                });
            },
            onMyBankTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '我的银行'
                        },
                        template: 'main/menu-header-V'
                    },
                    name: 'privacy-bank',
                    url: '../privacy/bank.html',
                    bounces: true,
                    slidBackEnabled: false
                });
            },
            onMyPointsTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '我的积分'
                        },
                        // template: 'main/menu-header-V'
                    },
                    name: 'privacy-bank-total',
                    url: '../privacy/bank-total.html',
                    bounces: true,
                    slidBackEnabled: false
                });
            },
            onTaskTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '我的任务'
                        },
                    },
                    name: 'privacy-task',
                    url: '../privacy/task.html',
                    bounces: true,
                    slidBackEnabled: false
                });
            },
            onSettingTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '设置'
                        }
                    },
                    name: 'privacy-setting',
                    url: '../privacy/setting.html',
                    bounces: true,
                    slidBackEnabled: false
                });
            },
            onSexTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '我的啪啪'
                        }
                    },
                    name: 'privacy-sex',
                    url: '../privacy/sex.html',
                    bounces: true,
                    slidBackEnabled: false
                });
            },
            onHistoryTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '我的收藏'
                        }
                    },
                    name: 'message-mine',
                    url: '../message/mine.html',
                    bounces: true,
                    slidBackEnabled: false,
                    pageParam: {
                        collectType: 5,
                    }
                });
            },
            onTrajectoryTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '我的轨迹'
                        },
                        template: 'main/menu-header-V'
                    },
                    name: 'privacy-trajectory',
                    url: '../privacy/trajectory.html',
                    bounces: true,
                    slidBackEnabled: true
                });
            },
            onMyTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '我的'
                        }
                    },
                    name: 'privacy-infomation',
                    url: '../privacy/information.html',
                    bounces: true,
                    slidBackEnabled: false
                });
            },
            onMineTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '我的主页'
                        }
                    },
                    name: 'message-mine',
                    url: '../message/mine.html',
                    bounces: true,
                    slidBackEnabled: false,
                    pageParam: {
                        typeIndex: 2
                    }
                });
            },
            onBusinessTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '业务推广'
                        }
                    },
                    name: 'activity-detail',
                    url: '../activity/detail.html',
                    bounces: true,
                    slidBackEnabled: false
                });
            },
            onVerifyTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '实名验证'
                        }
                    },
                    name: 'verification-index',
                    url: '../verification/index.html',
                    bounces: true,
                    slidBackEnabled: false
                });
            },
            onVerdictTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '活动裁决'
                        }
                    },
                    name: 'message-vslist',
                    url: '../message/vslist.html',
                    bounces: true,
                    slidBackEnabled: false,
                    pageParam: {
                        type: 2,
                    }
                });
            }
        },
    });

    //一部手机多账号登录的判断
    function getSign() {
        if (typeof Sign != 'undefined') {
            _.each(Sign, function(item, index) {
                if (item.id == userID) {
                    mine.signIn = true;
                } else {
                    mine.signIn = false;
                    signArr.push({
                        id: item.id,
                        isSign: item.isSign
                    });
                }

            });
        }
    }
    getSign();

    //到12点清签到缓存
    var date = new Date().getTime();
    var endDate = new Date().Format('yyyy-MM-dd') + ' ' + '23:59:59';
    var end = new Date(endDate.replace(/-/g, '/')).getTime();
    if (date >= end) {
        _g.rmLS('Sign');
        mine.signIn = false;
    }

    function getData() {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
            },
            lock: false,
            isSync: true,
            url: '/user/getUserInfo',
            success: function(ret) {
                if (ret.code == 200) {
                    setTimeout(function() {
                        var item = ret.data.userInfo;
                        var percent = (Number(item.infoPercent) * 100) + '';
                        percent = percent.substring(0, 5) + "%";
                        mine.account = item.account || '';
                        mine.avatar = CONFIG.HOST + item.avatar || '';
                        mine.nickName = item.name || '';
                        mine.sex = item.sex || '';
                        mine.phone = item.phone || '';
                        mine.progress = percent || '';
                    }, 0);

                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    getData();
    //更新数据
    api && api.addEventListener({
        name: 'updateInfo'
    }, function() {
        getData();
    });
    //更新头像
    api && api.addEventListener({
        name: 'updateAvatar',
    }, function() {
        getData();
    });
});
