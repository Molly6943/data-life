define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var directory = 'message';
    var page = 1;
    var type = api.pageParam.type;
    var vslist = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/vslist-main-V'),
        data: {
            list: [{
                complaintID: 0,
                fromAvatar: '',
                fromVoteNum: 20,
                fromName: 'Molly',
                toAvatar: '',
                toVoteNum: '38',
                toName: '祝成',
            }]
        },
        created: function() {
            this.list = [];
        },
        methods: {
            onDetailTap: function(id) {
                if(type == 2) {
                    _g.openWin({
                        header: {
                            data: {
                                title: '投票裁决'
                            }
                        },
                        name: 'message-vote',
                        url: '../message/vote.html',
                        pageParam: {
                            complaintID: id,
                            type:2,
                        }
                    });
                }else {
                    _g.openWin({
                        header: {
                            data: {
                                title: '投票裁决'
                            }
                        },
                        name: 'message-vote',
                        url: '../message/vote.html',
                        pageParam: {
                            complaintID: id,
                        }
                    });
                }
            },
        },
    });

    function getData() {
        if(type == 2) {
            type = type;
        }else {
            type = 1;
        }
        Http.ajax({
            data: {
                type:type,
                page: page,
            },
            isSync: true,
            url: '/me/complaintList',
            success: function(ret) {
                if (ret.code == 200) {
                    setTimeout(function() {
                        if (ret.data.length == 0) {
                            _g.toast('没有更多了~');
                            window.isNoMore = true;
                        }
                        if (page == 1) {
                            vslist.list = machData(ret.data);
                        } else {
                            vslist.list = vslist.list.concat(machData(ret.data));
                        }
                    }, 0);
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
                complaintID: item.complaint.complaintID,
                fromAvatar: CONFIG.HOST + item.fromID.avatar,
                fromVoteNum: item.complaint.supportFromNum,
                fromName: item.fromID.name,
                toAvatar: CONFIG.HOST + item.toID.avatar,
                toVoteNum: item.complaint.supportToNum,
                toName: item.toID.name,
            }
        });
    }
    getData();

    _g.setPullDownRefresh(function() {
        page = 1;
        getData();
    });
    _g.setLoadmore(function() {
        page++;
        getData();
    });

    api.addEventListener({
        name:'privacy-vslist-getData',
    },function(ret,err) {
        getData();
    });

    api.addEventListener({
        name: 'message-vslist-refreshFrame'
    }, function(ret, err) {
        getData();
    });

});
