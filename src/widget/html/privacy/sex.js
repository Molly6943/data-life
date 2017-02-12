define(function(require, exports, module) {

    var directory = 'privacy';
    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var sum = 0;
    var dayTotal = 0;
    var sex = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/sex-main-V'),
        data: {
            tab: 0,
            dateList: [{
                date: '',
                list: [{
                    startTime: '',
                    endTime: '',
                    month: '',
                    duration: ''
                }],
            }],
            totalTime: 2
        },
        computed: {
            showPie: function() {
                return this.tab === 1 ? true : false;
            },
            showList: function() {
                return this.tab === 0 ? true : false;
            }
        },
        methods: {
            changeTab: function(index) {
                this.tab = index;
            }
        },
    });
    var pie = echarts.init(document.getElementById('pie'));

    var labelTop = {
        normal: {
            color: 'grey',
            label: {
                show: true,
                position: 'center',
                formatter: '{b}',
                textStyle: {
                    baseline: 'middle'
                }
            },
            labelLine: {
                show: false
            }
        }
    };

    var options = {
        legend: {
            orient: 'vertical',
            x: 'center',
            y: 'center',
            data: ['24小时']
        },
        series: [{
            name: '访问来源',
            type: 'pie',
            radius: ['25%', '78%'],
            label: {
                normal: {
                    position: 'outer'
                }
            },
            data: [{
                value: 0,
                name: '24小时',
                itemStyle: labelTop
            }, {
                value: 0,
                name: '',
                itemStyle: {
                    normal: {
                        color: '#F5694B'
                    }
                }
            }, {
                value: 0,
                name: '',
                itemStyle: {
                    normal: {
                        color: '#BB2FD8'
                    }
                }
            }]
        }]
    };

    pie.setOption(options);

    function getData() {
        Http.ajax({
            data: {
                page: 1,
                type: 12,
                userID: UserInfo.userID,
            },
            isSync: true,
            url: '/action/mySex',
            success: function(ret) {
                if (ret.code == 200) {
                    sex.dateList = machData(ret.data);
                    options.series[0].data[1].value = sum;
                    options.series[0].data[1].name = sum + '次';
                    options.series[0].data[2].value = dayTotal;
                    options.series[0].data[2].name = dayTotal + '次';
                    pie.setOption(options);
                    sex.totalTime = sum;
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function machData(data) {
        return _.map(data, function(item, index) {
            sum = sum + data[index].list.length; //总数
            var oldyear = item.ymArr.slice(0, 5);
            var now = new Date();
            var nowDate = now.Format("yyyy.MM.dd");
            return {
                date: item.ymArr,
                list: _.map(data[index].list, function(item, listIndex) {
                    var oldDay = data[index].list[listIndex].date;
                    var oldDate = oldyear + oldDay;
                    if (oldDate == nowDate) {
                        dayTotal = dayTotal + 1; //当天的次数
                    }
                    if (item.duration >= 60) {
                        var hour = item.duration / 60; //小时
                        var min = item.duration % 60; //分钟
                        if (min != 0) {
                            var timeText = parseInt(hour) + '小时' + min + '分钟';
                        } else if (min == 0) {
                            var timeText = parseInt(hour) + '小时'
                        }
                    } else if (item.duration < 60 && item.duration > 0) {
                        var timeText = item.duration + '分钟';
                    } else if (item.duration <= 0) {
                        var timeText = 0 + '分钟';
                    }
                    return {
                        month: item.date,
                        startTime: item.startTime,
                        endTime: item.endTime,
                        duration: timeText,
                    }
                })
            }
        })
    }
    getData();
});
