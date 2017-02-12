define(function(require, exports, module) {
    var directory = 'privacy';
    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var type = api.pageParam.type;

    var trajectoryTrack = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/trajectoryTrack-main-V'),
        data: {
            list: [{
                value: 0,
                name: '餐饮',
                itemStyle: {
                    normal: {
                        color: '#F5694B'
                    }
                }
            }]
        },
        methods: {},
    });

    var rsbPie = echarts.init(document.getElementById('rsb-pie'));

    var options = {
        legend: {
            orient: 'vertical',
            x: 'center',
            // data: ['餐饮', '着装', '交通', '工作', '社交', '购物', '亲子', '运动', '娱乐', '旅游', '学习', '家政', '啪啪',
            //     '睡觉', '其它'
            // ]
        },
        series: [{
            name: '访问来源',
            type: 'pie',
            radius: ['25%', '62%'],
            // label: {
            //     normal:{
            //       show:false
            //     }
            //   },
            data:[],
        }]
    };
    rsbPie.setOption(options);

    function getData() {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
                statisticsType: type,
                page:1
            },
            isSync: true,
            url: '/action/getActionSheetStatistics',
            success: function(ret) {
                if (ret.code == 200) {
                    trajectoryTrack.list = matchData(ret.data.statisticsTime);
                    options.series[0].data = matchSeriesData(trajectoryTrack.list);
                    rsbPie.setOption(options);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    function matchData(data) {
        return _.map(data,function(item,index) {
            return {
                value: item.time,
                name: item.type + ' ' + item.time,
                itemStyle: {
                    normal: {
                        color: fetchColor(item.type)
                    }
                }
            }
        });
    }

    function matchSeriesData(data){
        var data = _.filter(data, function(item){
            return item.value
        });
        return _.map(data,function(item,index) {
            return {
                value: item.value,
                name: item.name.slice(0, 2),
                itemStyle: item.itemStyle
            }
        });
    }

    function fetchColor(value){
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
        return color[value.slice(0, 2)] || '#FFFFFF';
    }

    getData();

});
