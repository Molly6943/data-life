define(function(require, exports, module) {

    var directory = 'privacy';
    var UserInfo = _g.getLS('UserInfo');
    var type = api.pageParam.type;
    var Http = require('U/http');
    var page = 1;
    var taskList = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/taskList-main-V'),
        data: {
            list: [{
                end: false,
                actionID: 0,
                avatar: '',
                name: '',
                people: '',
                address: '',
                startTime: '',
                endTime: ''
            }]
        },
        created: function() {},
        methods: {
            onDetailTap: function(actionID, name) {
                if (type == 1) {
                    _g.openWin({
                        header: {
                            data: {
                                title: UserInfo.name + '的任务',
                                rightText: '撤销发布'
                            }
                        },
                        name: 'privacy-taskDetail',
                        url: '../privacy/taskDetail.html',
                        pageParam: {
                            actionID: actionID,
                        }
                    });
                } else {
                    _g.openWin({
                        header: {
                            data: {
                                title: name + '的活动',
                                // rightText:'退出活动'
                            }
                        },
                        name: 'privacy-taskDetail',
                        url: '../privacy/taskDetail.html',
                        pageParam: {
                            actionID: actionID,
                        }
                    });
                }
            }
        },
        ready: function() {

        }
    });

    function getData() {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
                page: page,
                type: type,
            },
            isSync: true,
            url: '/me/actionList',
            success: function(ret) {
                if (ret.code == 200) {
                    setTimeout(function() {
                        if (ret.data == null) {
                            _g.toast('没有更多了~');
                            return;
                        }
                        if (ret.data.length == 0) {
                            _g.toast('没有更多了~');
                            window.isNoMore = true;
                        }
                        if (page == 1) {
                            taskList.list = machData(ret.data);
                        } else {
                            taskList.list = taskList.list.concat(machData(ret.data));
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
        return _.map(data, function(item, index) {
            var nowTime = new Date();
            var endDate = parseInt(Date.parse(data[index].action.endTime) / 1000);
            var nowDate = parseInt((Date.parse(nowTime) + (8 * 60 * 60 * 1000)) / 1000);
            if (endDate <= nowDate) {
                end = true;
            } else {
                end = false;
            }
            //时间戳转日期时间
            var starttime = new Date(item.action.startTime).Format('yyyy-MM-dd');
            var endtime = new Date(item.action.endTime).Format('yyyy-MM-dd');
            return {
                actionID: item.action.actionID || '',
                avatar: CONFIG.HOST + item.user.avatar || '',
                name: item.user.name || '',
                people: item.action.joinNum || 0,
                address: item.action.address.addr || '',
                // startTime: item.action.startTime ? item.action.startTime.slice(0, 10) : '',
                // endTime: item.action.endTime ? item.action.endTime.slice(0, 10) : '',
                startTime:starttime,
                endTime:endtime,
                end: end,
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
        name: 'privacy-taskList-updateData'
    }, function(ret, err) {
        getData();
    });
});
