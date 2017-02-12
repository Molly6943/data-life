define(function(require, exports, module) {
    var Http = require('U/http');
    var directory = 'privacy';
    var shareSDK = require('U/shareSDK');
    var UserInfo = _g.getLS('UserInfo');
    var actionID = api.pageParam.actionID;
    var actionEnd;
    var taskDetail = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/taskDetail-main-V'),
        data: {
            nickName:'',
            userID: 0,
            isGiveMoney: false,
            isGetMoney: false,
            starNum: '',
            target: '',
            sponsor: '',
            content: '',
            thinks: '',
            startTime: '00：00',
            endTime: '00：00',
            classType: 0,
            addr: '',
            isEnd:0,
            XSMoney: '',
            DSMoney: '',
            QSMoney: '',
            DJMoney: '',
            images: [],
            startIndex: 0,
            stars: [{
                stars: true,
                pic: '../../image/privacy/task/start2.png'
            }, {
                stars: true,
                pic: '../../image/privacy/task/start2.png'
            }, {
                stars: true,
                pic: '../../image/privacy/task/start2.png'
            }, {
                stars: true,
                pic: '../../image/privacy/task/start2.png'
            }, {
                stars: true,
                pic: '../../image/privacy/task/start2.png'
            }],
            colAction: false,
            collect: '../../image/message/message-collect.png',
            text: '',
            favObj: [{
                userID: '',
                avatar: '',
                addDate: '',
                lastTime: ''
            }],
            joinObj: {
                userID: 0,
                addDate: '',
            }
        },
        created: function() {

        },
        methods: {
            openComplain: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '投诉'
                        }
                    },
                    name: 'privacy-taskComplain',
                    url: '../privacy/taskComplain.html',
                    pageParam: {
                        actionID: actionID
                    }
                });
            },
            onStarTap: function(index) {
                taskDetail.starNum = index + 1;
                if (index > 0) {
                    _.each(taskDetail.stars, function(n, i) {
                        n.pic = '../../image/privacy/task/start2.png';
                    });
                    _.each(taskDetail.stars, function(n, i) {
                        if (i <= index) {
                            n.pic = '../../image/privacy/task/start.png';
                        }
                    });
                } else if (index == 0 && taskDetail.stars[0].pic == '../../image/privacy/task/start.png') {
                    if (taskDetail.stars[1].pic == '../../image/privacy/task/start.png') {
                        for (var i = 1; i < taskDetail.stars.length; i++) {
                            taskDetail.stars[i].pic = '../../image/privacy/task/start2.png';
                        }
                    } else {
                        taskDetail.stars[0].pic = '../../image/privacy/task/start2.png';
                    }
                } else if (index == 0 && taskDetail.stars[0].pic == '../../image/privacy/task/start2.png') {
                    taskDetail.stars[0].pic = '../../image/privacy/task/start.png';
                }
            },
            onSubmitTap: function() {
                postStar();
            },
            onCollectTap: function() {
                _g.commonAction(UserInfo.userID, actionID, 3, Http, taskDetail.colNum, taskDetail.colAction, function() {
                    if (taskDetail.colAction == true) {
                        taskDetail.collect = '../../image/message/message-collect.png';
                        // taskDetail.colNum = taskDetail.colNum - 1;
                        taskDetail.colAction = false;
                    } else if (taskDetail.colAction == false) {
                        taskDetail.collect = '../../image/message/icon-collect.png';
                        // taskDetail.colNum = taskDetail.colNum + 1;
                        taskDetail.colAction = true;
                    }
                });
            },
            onTextTap: function() {
                if (taskDetail.userID == UserInfo.userID) {
                    if(taskDetail.isEnd == 2) {
                        //确认完成
                        Http.ajax({
                            data: {
                                type: taskDetail.classType,
                                actionID: actionID
                            },
                            isSync: true,
                            url: '/action/postDone',
                            success: function(ret) {
                                if (ret.code == 200) {
                                    _g.toast(ret.msg);
                                } else {
                                    _g.toast(ret.msg);
                                }
                            },
                            error: function(err) {}
                        });
                    }
                } else {
                    if (taskDetail.isEnd == 0) {
                        //立即参加
                        Http.ajax({
                            data: {
                                userID: UserInfo.userID,
                                actionID: actionID
                            },
                            isSync: true,
                            url: '/action/joinAction',
                            success: function(ret) {
                                if (ret.code == 200) {
                                    if(UserInfo.userID == taskDetail.userID) {
                                        taskDetail.text = '正在进行';
                                    }else {
                                        taskDetail.text = '完成任务';
                                    }
                                    _g.toast(ret.msg);
                                } else {
                                    _g.toast(ret.msg);
                                }
                            },
                            error: function(err) {}
                        });
                    } else if (taskDetail.isEnd == 1) {
                        //完成任务
                        Http.ajax({
                            data: {
                                type: taskDetail.classType,
                                actionID: actionID
                            },
                            isSync: true,
                            url: '/action/postDone',
                            success: function(ret) {
                                if (ret.code == 200) {
                                    _g.toast(ret.msg);
                                } else {
                                    _g.toast(ret.msg);
                                }
                            },
                            error: function(err) {}
                        });
                    }
                }
            },
            onShareTap: function() {
                shareSDK.init();
                shareSDK.openShare();
            },
            onPicTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: taskDetail.nickName,
                        },
                        // template: 'main/barMenu-header-V'
                    },
                    pageParam: {
                        actionID: actionID,
                        marketType:1,
                    },
                    name: 'message-detail',
                    url: '../message/detail.html',
                    bounces: true,
                    slidBackEnabled: false,
                });
            }
        },
    });

    function postStar() {
        if(taskDetail.isEnd != 3){
            _g.toast('活动未结束，暂时不能评价')
        }else {
            Http.ajax({
                data: {
                    userID: UserInfo.userID,
                    actionID: actionID,
                    evaNum: taskDetail.starNum,
                },
                isSync: true,
                url: '/action/postEvaluate',
                success: function(ret) {
                    if (ret.code == 200) {

                    } else {
                        _g.toast(ret.msg);
                    }
                },
                error: function(err) {}
            });
        }
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
                    taskDetail.isEnd = data.isEnd || 0;
                    taskDetail.startIndex = data.avgEvaNum || 0;
                    taskDetail.target = data.target || '';
                    taskDetail.userID = data.userInfo.userID || '';
                    taskDetail.nickName = data.userInfo.name || '';
                    taskDetail.sponsor = data.userInfo.name || '';
                    taskDetail.content = data.content || '';
                    taskDetail.thinks = data.thinks || '';
                    taskDetail.classType = data.classType || 0;
                    // taskDetail.startTime = data.startTime ? data.startTime.slice(10, 16) : '';
                    // taskDetail.endTime = data.endTime ? data.endTime.slice(10, 16) : '';
                    taskDetail.addr = data.address.city + data.address.area + data.address.addr || '';
                    taskDetail.XSMoney = data.XSMoney || '';
                    taskDetail.DSMoney = data.DSMoney || '';
                    taskDetail.QSMoney = data.QSMoney || '';
                    taskDetail.DJMoney = data.DJMoney || '';
                    taskDetail.images = data.images ? data.images : [];
                    taskDetail.favObj = machFavObj(ret.data.favObj);
                    taskDetail.joinObj = machJoinObj(ret.data.joinObj);
                    //判断活动时间是否结束
                    var nowTime = new Date().getTime();
                    var endTime = data.endTime;
                    if (nowTime > endTime) {
                        actionEnd = true;
                    } else {
                        actionEnd = false;
                    }
                    //时间戳转日期时间
                    var start = new Date(data.startTime).Format('hh:mm');
                    taskDetail.startTime = start;
                    var end = new Date(data.endTime).Format('hh:mm');
                    taskDetail.endTime = end;
                    //星星展示
                    if (taskDetail.startIndex > 0) {
                        _.each(taskDetail.stars, function(n, i) {
                            if (i <= taskDetail.startIndex - 1) {
                                n.pic = '../../image/privacy/task/start.png';
                            }
                        });
                    }
                    //判断是否展示悬赏求赏
                    if (data.XSMoney == '0' && data.DSMoney == '0' && data.QSMoney == '0' && data.DJMoney == '0') {
                        taskDetail.isGetMoney = false;
                        taskDetail.isGiveMoney = false;
                    } else if (data.XSMoney != '0' || data.DSMoney != '0') {
                        taskDetail.isGiveMoney = true;
                        taskDetail.isGetMoney = false;
                    } else if (data.QSMoney != '0' || data.DJMoney != '0') {
                        taskDetail.isGetMoney = true;
                        taskDetail.isGiveMoney = false;
                    }
                    changeBtn();
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function machFavObj(data) {
        return _.map(data, function(item) {
            if (item.userID == UserInfo.userID) {
                taskDetail.colAction = true;
                taskDetail.collect = '../../image/message/icon-collect.png';
            }
            return {
                userID: item.userID,
                avatar: item.avatar,
                addDate: item.addDate,
                lastTime: item.lastTime
            }
        });
    }

    function changeBtn() {
        var UserInfo = _g.getLS('UserInfo');
        if (taskDetail.userID == UserInfo.userID) {
            taskDetail.text = '待参与';
            if(taskDetail.isEnd == 1) {
                taskDetail.text = '正在进行';
            }else if (taskDetail.isEnd == 2) {
                taskDetail.text = '确认完成';
            }else if (taskDetail.isEnd == 3) {
                taskDetail.text = '活动完成';
            }else if (taskDetail.isEnd == 5) {
                taskDetail.text = '正在裁决';
            }else if (taskDetail.isEnd == 6) {
                taskDetail.text = '裁决结束';
            }else if (taskDetail.isEnd == 7) {
                taskDetail.text = '活动时间结束';
            }
        } else {
            taskDetail.text = '立即参与';
            if(taskDetail.isEnd == 1) {
                taskDetail.text = '完成任务';
            }else if (taskDetail.isEnd == 2) {
                taskDetail.text = '待确认';
            }else if (taskDetail.isEnd == 3) {
                taskDetail.text = '活动完成';
            }else if (taskDetail.isEnd == 5) {
                taskDetail.text = '正在裁决';
            }else if (taskDetail.isEnd == 6) {
                taskDetail.text = '裁决结束';
            }else if (taskDetail.isEnd == 7) {
                taskDetail.text = '活动时间结束';
            }
        }
    }

    function machJoinObj(data) {
        var UserInfo = _g.getLS('UserInfo');
        var id = UserInfo.userID;
        if (data[id]) {
            return {
                userID: data[id].userID ? data[id].userID : 0,
                addDate: data[id].addDate ? data[id].addDate : '',
            }
        }

    }

    function cancelPublic() {

        Http.ajax({
            data: {
                actionID: actionID,
            },
            isSync: true,
            url: '/action/cancelAction',
            success: function(ret) {
                if (ret.code == 200) {
                    _g.toast(ret.msg);
                    _g.openWin({
                        header: {
                            data: {
                                title: '发布任务'
                            }
                        },
                        name: 'privacy-taskList',
                        url: '../privacy/taskList.html',
                        pageParam: {}
                    });
                    api.sendEvent({
                        name: 'privacy-taskList-updateData'
                    });
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    getData();

    api.addEventListener({
        name: 'privacy-taskDetail-cancel',
    }, function(ret, err) {
        if(actionEnd == true) {
            _g.toast('活动已经结束，不能撤销哦~');
        }else {
            cancelPublic();
        }
    });
});
