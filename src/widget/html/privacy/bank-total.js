define(function(require, exports, module) {

    var Http = require('U/http');
    var directory = 'privacy';
    var page = 1;

    var points = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/bank-total-main-V'),
        data: {
            total: 0,
            list: [{
                type: 0,
                date: '',
                point: 0,
            }],
        },
        methods: {},
    });

    function getData() {
        Http.ajax({
            data: {
                page: page,
            },
            isSync: true,
            url: '/action/myPoint',
            success: function(ret) {
                if (ret.code == 200) {
                    setTimeout(function() {
                        if (ret.data.length == 0) {
                            _g.toast('没有更多了~');
                            window.isNoMore = true;
                        }else {
                            if(page == 1) {
                                points.total = ret.data.total;
                                // alert(points.total)
                                points.list = matchData(ret.data.detail);
                            }else {
                                // alert(1)
                                // points.total = points.total + ret.data.total;
                                points.total = ret.data.total;
                                // alert(points.total)
                                points.list = points.list.concat(matchData(ret.data.detail));
                            }
                        }
                    }, 0);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function changeValue(type) {
        var a = ['收藏','注册','邀请','签到','发帖','点赞','评论','裁决投票扣除','裁决投票加分','参加活动','发布活动'];
        return a[type-1];
    }

    function matchData(data,data2) {
        return _.map(data, function(item, index) {
            return {
                type: changeValue(item.type),
                date: item.date.slice(0,10),
                point: item.value,
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

});
