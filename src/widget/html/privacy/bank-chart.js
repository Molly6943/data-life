define(function(require, exports, module) {

    var directory = 'privacy';
    var index = api.pageParam.index;
    var Http = require('U/http');

    var bankChart = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/bank-chart-main-V'),
        data: {
            setReward:0,
            giveReward:0,
            seekReward:0,
            Deposit:0,
        },
        methods: {
        },
    });

    var rsbPie = echarts.init(document.getElementById('chart-pie'));

    var option = {
        legend: {
            orient: 'vertical',
            x: 'left',
            data: ['餐饮', '着装', '交通', '工作', '社交', '购物', '亲子', '运动', '娱乐', '旅游', '学习', '家政', '啪啪',
                '睡觉', '其它'
            ]
        },
        series: [{
            name: '访问来源',
            type: 'pie',
            radius: ['25%', '62%'],
            /*label: {
                normal:{
                  show:false
                }
              },
            */
            data: [
                { value: 400, name: '悬赏金额', itemStyle: { normal: { color: '#F5694B' } } },
                { value: 335, name: '打赏金额', itemStyle: { normal: { color: '#FEAE08' } } },
                { value: 310, name: '求赏金额', itemStyle: { normal: { color: '#06AD92' } } },
                { value: 274, name: '定金金额', itemStyle: { normal: { color: '#87CB14' } } },
            ]
        }]
    }

    rsbPie.setOption(option);

    function getData() {
        Http.ajax({
            data: {
                statisticsType: index-1,
            },
            isSync: true,
            url: '/action/myBankStatistics',
            success: function(ret) {
                if (ret.code == 200) {
                    setTimeout(function() {
                        var data = ret.data;
                        bankChart.setReward = data.setReward;
                        bankChart.giveReward = data.giverReward;
                        bankChart.seekReward = data.seekReward;
                        bankChart.Deposit = data.Deposit;
                        option.series[0].data[0].value = data.setReward;
                        option.series[0].data[1].value = data.giverReward;
                        option.series[0].data[2].value = data.seekReward;
                        option.series[0].data[3].value = data.Deposit;
                        rsbPie.setOption(option);
                    }, 0);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    getData();
});
