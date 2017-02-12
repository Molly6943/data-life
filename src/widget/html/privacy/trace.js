define(function(require, exports, module) {
    var UserInfo = _g.getLS('UserInfo');
    var Http = require('U/http');
    var directory = 'privacy';
    var page = 1;

    var trace = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/trace-main-V'),
        data: {
            list: [{
                actionID:0,
                label: '',
                startTime: '',
                endTime: '',
            }],
        },
        ready: function() {

        },
        methods: {
            onNoteTap: function(index) {
                _g.openWin({
                    header: {
                        data: {
                            title: '随手一记'
                        },
                    },
                    name: 'privacy-bank',
                    url: '../privacy/bank-record.html',
                    bounces: true,
                    slidBackEnabled: false,
                    pageParam:{
                        label:trace.list[index].label,
                        actionID:trace.list[index].actionID,
                        startTime: trace.list[index].startTime,
                        endTime: trace.list[index].endTime,
                    }
                });
            }
        },
    });

    function getData() {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
                statisticsType: 4,
                page: page,
            },
            isSync: true,
            url: '/action/getActionSheetStatistics',
            success: function(ret) {
                if (ret.code == 200) {
                    setTimeout(function() {
                        if (ret.data.length == 0) {
                            _g.toast('没有更多了~');
                            window.isNoMore = true;
                        }
                        if(page == 1) {
                            trace.list = machData(ret.data);
                        }else {
                            trace.list = trace.list.concat(machData(ret.data));
                        }
                    },0);
                    setTimeout(function() {
                        setColor();
                    }, 0);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function setColor() {
        var color = {
            '餐饮': '#F5694B',
            '运动': '#FEAE08',
            '衣着': '#06AD92',
            '娱乐': '#87CB14',
            '交通': '#13E1C7',
            '住宿': '#BB2FD8',
            '工作': '#DDC698',
            '学习': '#7FB8C4',
            '购物': '#3384FF',
            '家务': '#FF9076',
            '社交': '#AF4373',
            '啪啪': '#2b0fff',
            '亲子': '#FFC8B2',
            '睡觉': '#7889A2',
            '其它': '#8D6725'
        };
        $('.trace-main > ul > li').each(function(index) {
            var value = $(this).find('.name').html();
            $(this).css('background-color', color[value]);
            $(this).find('.name').css('color', color[value]);
        });
    }

    function machData(data) {
        var list = data.statisticsDetail;
        return _.map(list, function(item, index) {
            return {
                actionID: item.actionID || 0,
                label: item.label || '',
                startTime: item.startTime.slice(10, 16) || '',
                endTime: item.endTime.slice(10, 16) || '',
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

    //收听到随手一记的监听，并刷新数据
    api.addEventListener({
        name:'privacy-trace-getData'
    },function(ret,err) {
        getData();
    });
});
