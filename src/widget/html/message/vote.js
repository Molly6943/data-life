define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var directory = 'message';
    var complaintID = api.pageParam.complaintID;
    var type = api.pageParam.type;
    var vote = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/vote-main-V'),
        data: {
            showSupport:true,
            showResponse:false,
            showVoteNum:true,
            isGiveMoney: false,
            isGetMoney: false,
            detail: {
                fromID: 0,
                toID: 0,
                complaintID: 0,
                fromAvatar: '',
                fromName: '',
                supportFromNum: 1,
                toAvatar: '',
                toName: '',
                supportToNum: 5,
                startTime: '2016-10-09',
                endTime: '2016-10-09',
                endDay: 4,
                startTimeHour: '12:00',
                endTimeHour: '10:00',
                target: '搬桌子',
                content:'',
                thinks:'',
                address: 'new york',
                XSMoney: '20',
                DSMoney: '34',
                QSMoney: '0',
                DJMoney: '0',
                toContent: 'love peace',
                fromContent: 'hate you',
                start: '',
            }
        },
        created: function() {
            this.detail = [];
            if(type == 2) {
                this.showResponse = true;
                this.showSupport = false;
            }else {
                this.showResponse = false;
                this.showSupport = true;
            }
        },
        methods: {
            onSupportTap: function(type) {
                if (UserInfo.userID == vote.detail.fromID || UserInfo.userID == vote.detail.toID) {
                    _g.toast('当事人不能投票哦~');
                } else {
                    Http.ajax({
                        data: {
                            userID: UserInfo.userID,
                            type: type,
                            complaintID: complaintID
                        },
                        isSync: true,
                        url: '/me/vote',
                        success: function(ret) {
                            if (ret.code == 200) {
                                getData();
                                api.sendEvent({
                                    name:'privacy-vslist-getData'
                                });
                            } else {
                                _g.toast(ret.msg);
                            }
                        },
                        error: function(err) {}
                    });
                }
            },
            onResponseTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '回应投诉',
                        }
                    },
                    name: 'privacy-taskComplain',
                    url: '../privacy/taskComplain.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {
                        type:2,
                        complaintID:vote.detail.complaintID
                    }
                });
            }
        },
    });

    function getData() {
        Http.ajax({
            data: {
                complaintID: complaintID,
            },
            isSync: true,
            url: '/me/complaintDetail',
            success: function(ret) {
                if (ret.code == 200) {
                    vote.detail = machData(ret.data);
                    if (vote.detail.XSMoney == '0' && vote.detail.DSMoney == '0' && vote.detail.QSMoney == '0' && vote.detail.DJMoney == '0') {
                        vote.isGetMoney = false;
                        vote.isGiveMoney = false;
                    } else if (vote.detail.XSMoney != '0' || vote.detail.DSMoney != '0') {
                        vote.isGiveMoney = true;
                        vote.isGetMoney = false;
                    } else if (vote.detail.QSMoney != '0' || vote.detail.DJMoney != '0') {
                        vote.isGetMoney = true;
                        vote.isGiveMoney = false;
                    }
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function machData(data) {
        var nowTime = new Date();
        var endDate = parseInt(Date.parse(data.endTime) / (1000 * 60 * 60));
        var nowDate = parseInt(Date.parse(nowTime) / (1000 * 60 * 60));
        var needDate = (endDate - nowDate);
        if (needDate >= 24) {
            var munText = parseInt(needDate / 24) + '天后';
        } else if (needDate < 24 && needDate > 0) {
            var munText = parseInt(needDate) + '小时后';
        }else if (needDate <= 0) {
            vote.showVoteNum = true;
            var munText = '已';
        }
        return {
            fromID: data.fromID._id,
            toID: data.toID._id,
            complaintID: data._id,
            fromAvatar: data.fromID.avatar,
            fromName: data.fromID.name,
            supportFromNum: data.supportFromNum,
            toAvatar: data.toID.avatar,
            toName: data.toID.name,
            supportToNum: data.supportToNum,
            startTime: data.startTime ? data.startTime.slice(0, 10) : '',
            endTime: data.endTime ? data.endTime.slice(0, 10) : '',
            endDay: munText,
            startTimeHour: data.actionID.startTime ? data.actionID.startTime.slice(11, 16) : '',
            endTimeHour: data.actionID.startTime ? data.actionID.startTime.slice(11, 16) : '',
            content: data.actionID.content,
            thinks:data.actionID.thinks,
            address: data.actionID.address.addr,
            XSMoney: data.actionID.XSMoney,
            DSMoney: data.actionID.DSMoney,
            QSMoney: data.actionID.QSMoney,
            DJMoney: data.actionID.DJMoney,
            toContent: data.toContent,
            fromContent: data.fromContent,
            start: data.actionID.startTime.slice(0, 10),
        }
    }

    getData();

    api.addEventListener({
        name:'privacy-vote-getData'
    },function(ret,err) {
        getData();
    });
});
