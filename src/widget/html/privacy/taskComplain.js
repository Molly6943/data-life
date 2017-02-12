define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var directory = 'privacy';
    var actionID = api.pageParam.actionID;
    var complaintID = api.pageParam.complaintID;
    var type = api.pageParam.type;
    var taskComplain = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/taskComplain-main-V'),
        data: {
            showResponse:false,
            selectId: 0,
            showText: true,
            list: [{
                id: 1,
                content: '',
                showupArrow: false,
                showdownArrow: true,
                showTextarea: false,
                text: '淫秽色情'
            }, {
                id: 2,
                content: '',
                showupArrow: false,
                showdownArrow: true,
                showTextarea: false,
                text: '血腥暴力'
            }, {
                id: 3,
                content: '',
                showupArrow: false,
                showdownArrow: true,
                showTextarea: false,
                text: '违法行为（涉毒、暴恐、违禁品等）'
            }, {
                id: 4,
                content: '',
                showupArrow: false,
                showdownArrow: true,
                showTextarea: false,
                text: '价格不合理'
            }, {
                id: 5,
                content: '',
                showupArrow: false,
                showdownArrow: true,
                showTextarea: false,
                text: '活动与实情不符'
            }, {
                id: 6,
                content: '',
                showupArrow: false,
                showdownArrow: true,
                showTextarea: false,
                text: '服务质量差'
            }],
        },
        created:function() {
            if(type == 2) {
                this.showResponse = true;
            }
        },
        methods: {
            onComplainTap: function(index) {
                this.selectId = index;
                if (taskComplain.list[index].showTextarea == true) {
                    this.list[index].showupArrow = false;
                    this.list[index].showdownArrow = true;
                    this.list[index].showTextarea = false;
                } else {
                    this.list[index].content = '';
                    this.list[index].showupArrow = true;
                    this.list[index].showdownArrow = false;
                    this.list[index].showTextarea = true;
                }
            },
            onCancelTap: function() {
                api.closeWin();
            },
            onSubmitTap: function() {
                postData();
            },
            onResponseTap: function() {
                Http.ajax({
                    data: {
                        complaintID:complaintID,
                        content: taskComplain.list[taskComplain.selectId].content,
                    },
                    isSync: true,
                    url: '/me/responseComplaint',
                    success: function(ret) {
                        if (ret.code == 200) {
                            _g.toast(ret.msg);
                            api.sendEvent({
                                name:'privacy-vote-getData'
                            });
                            _g.openWin({
                                header: {
                                    data: {
                                        title: '活动裁决',
                                    }
                                },
                                name: 'message-vote',
                                url: '../message/vote.html',
                                bounces: false,
                                slidBackEnabled: false,
                                pageParam: {
                                }
                            });
                        } else {
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {}
                });
            }
        },
    });

    function postData() {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
                actionID: actionID,
                comType: taskComplain.selectId+1,
                fromContent: taskComplain.list[taskComplain.selectId].content,
            },
            isSync: true,
            url: '/me/submitComplaint',
            success: function(ret) {
                if (ret.code == 200) {
                    _g.toast(ret.msg);
                    _g.openWin({
                        header: {
                            data: {
                                title: '活动裁决',
                            }
                        },
                        name: 'message-vslist',
                        url: '../message/vslist.html',
                        bounces: false,
                        slidBackEnabled: false,
                        pageParam: {
                        }
                    });
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
});
