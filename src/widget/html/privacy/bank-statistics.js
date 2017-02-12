define(function(require, exports, module) {

    var Http = require('U/http');
    var directory = 'privacy';
    var page = 1;

    var statistics = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/bank-statistics-main-V'),
        data: {
            list: [{
                type: '',
                date: '',
                value: 0,
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
            url: '/action/myBankDetail',
            success: function(ret) {
                if (ret.code == 200) {
                    setTimeout(function() {
                        if (ret.data.length == 0) {
                            _g.toast('没有更多了~');
                            window.isNoMore = true;
                        }
                        if(page == 1) {
                            statistics.list = matchData(ret.data);
                        }else {
                            statistics.list = statistics.list.concat(matchData(ret.data));
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
        var a = ['当前余额','悬赏金额','打赏金额','求赏金额','定金金额','待收金额','甲方胜(悬赏)金额返还','乙方胜(求赏)获得全额','乙方胜(求赏)甲方全额支付','支付宝充值','微信充值','银行卡充值','提现到支付宝','悬赏失败返还','打赏失败返还','提现到银行卡','完成悬赏金','完成打赏金','完成求赏金','完成定金'];
        return a[type-1];
    }

    function matchData(data) {
        return _.map(data, function(item, index) {
            return {
                type: changeValue(item.type),
                date: item.date.slice(0,10),
                value: item.value,
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
