define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var directory = 'privacy';
    var resultArr = [];

    var taskChart = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/task-chart-main-V'),
        data: {
            tab: 0,
            date: '2016-04',
            myXS: 0,
            getXS: 0,
            myQS: 0,
            getQS: 0,
            QStotal: 0,
            XStotal: 0,
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
        ready: function() {

        }
    });
    var pie1 = echarts.init(document.getElementById('pie-1'));
    var option1 = {
        legend: {
            orient: 'vertical',
            x: 'left',
            data: ['发布任务', '接受任务']
        },
        series: [{
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '100%'],
            label: {
                normal: {
                    show: false
                }
            },
            data: [{
                    value: 0,
                    name: '发布任务',
                    itemStyle: {
                        normal: {
                            color: '#F5694B'
                        }
                    }
                }, {
                    value: 0,
                    name: '接受任务',
                    itemStyle: {
                        normal: {
                            color: '#FEAE08'
                        }
                    }
                },
                // { value: 1, name: '组团任务', itemStyle: { normal: { color: '#06AD92' } } }
            ]
        }]
    }
    pie1.setOption(option1);

    var pie2 = echarts.init(document.getElementById('pie-2'));

    var option2 = {
        legend: {
            orient: 'vertical',
            x: 'left',
            data: ['发布业务', '接受业务']
        },
        series: [{
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '100%'],
            label: {
                normal: {
                    show: false
                }
            },
            data: [{
                    value: 0,
                    name: '发布业务',
                    itemStyle: {
                        normal: {
                            color: '#87CB14'
                        }
                    }
                }, {
                    value: 0,
                    name: '接受业务',
                    itemStyle: {
                        normal: {
                            color: '#13E1C7'
                        }
                    }
                },
                // { value: 3, name: '组团业务', itemStyle: { normal: { color: '#BB2FD8' } } }
            ]
        }]
    }
    pie2.setOption(option2);


    api.addEventListener({
        name: 'privacy-taskChart-actionSheet'
    }, function(ret, err) {
        api.actionSheet({
            cancelTitle: '取消',
            buttons: ['本年统计', '本季统计', '本周统计', '今天统计'],
            style: {
                layerColor: '', //遮蔽层颜色，仅支持 rgba颜色，默认值：rgba（0, 0, 0, 0.4）
                itemNormalColor: '#F0F0F0', //选项按钮正常状态背景颜色，支持#000、#000000、rgb、rgba，默认值：#F1F1F1
                itemPressColor: '#F0F0F0', //选项按钮按下时背景颜色，支持#000、#000000、rgb、rgba，默认值：#E6E6E6
                fontNormalColor: '#3D3D3D', //选项按钮正常状态文字颜色，支持#000、#000000、rgb、rgba，默认值：#007AFF
                fontPressColor: '#3D3D3D', //选项按钮按下时文字颜色，支持#000、#000000、rgb、rgba，默认值：#0060F0
                titleFontColor: '' //标题文字颜色，支持#000、#000000、rgb、rgba，默认值：#8F8F8F
            }
        }, function(ret, err) {
            if (ret.buttonIndex == 1) {
                taskChart.myXS = resultArr.myXS.actionNumYear;
                taskChart.getXS = resultArr.getXS.actionNumYear;
                taskChart.myQS = resultArr.myQS.actionNumYear;
                taskChart.getQS = resultArr.getQS.actionNumYear;
                taskChart.QStotal = resultArr.myQS.actionNumYear + resultArr.getQS.actionNumYear;
                taskChart.XStotal = resultArr.myXS.actionNumYear + resultArr.getXS.actionNumYear;
                option2.series[0].data[0].value = resultArr.myQS.actionNumYear;
                option2.series[0].data[1].value = resultArr.getQS.actionNumYear;
                option1.series[0].data[0].value = resultArr.myXS.actionNumYear;
                option1.series[0].data[1].value = resultArr.getXS.actionNumYear;
                pie1.setOption(option1);
                pie2.setOption(option2);
            } else if (ret.buttonIndex == 2) {
                taskChart.myXS = resultArr.myXS.actionNumQuarter;
                taskChart.getXS = resultArr.getXS.actionNumQuarter;
                taskChart.myQS = resultArr.myQS.actionNumQuarter;
                taskChart.getQS = resultArr.getQS.actionNumQuarter;
                taskChart.QStotal = resultArr.myQS.actionNumQuarter + resultArr.getQS.actionNumQuarter;
                taskChart.XStotal = resultArr.myXS.actionNumQuarter + resultArr.getXS.actionNumQuarter;
                option2.series[0].data[0].value = resultArr.myQS.actionNumQuarter;
                option2.series[0].data[1].value = resultArr.getQS.actionNumQuarter;
                option1.series[0].data[0].value = resultArr.myXS.actionNumQuarter;
                option1.series[0].data[1].value = resultArr.getXS.actionNumQuarter;
                pie1.setOption(option1);
                pie2.setOption(option2);
            } else if (ret.buttonIndex == 3) {
                taskChart.myXS = resultArr.myXS.actionNumWeek;
                taskChart.getXS = resultArr.getXS.actionNumWeek;
                taskChart.myQS = resultArr.myQS.actionNumWeek;
                taskChart.getQS = resultArr.getQS.actionNumWeek;
                taskChart.QStotal = resultArr.myQS.actionNumWeek + resultArr.getQS.actionNumWeek;
                taskChart.XStotal = resultArr.myXS.actionNumWeek + resultArr.getXS.actionNumWeek;
                option2.series[0].data[0].value = resultArr.myQS.actionNumWeek;
                option2.series[0].data[1].value = resultArr.getQS.actionNumWeek;
                option1.series[0].data[0].value = resultArr.myXS.actionNumWeek;
                option1.series[0].data[1].value = resultArr.getXS.actionNumWeek;
                pie1.setOption(option1);
                pie2.setOption(option2);
            } else if (ret.buttonIndex == 4) {
                taskChart.myXS = resultArr.myXS.actionNumDay;
                taskChart.getXS = resultArr.getXS.actionNumDay;
                taskChart.myQS = resultArr.myQS.actionNumDay;
                taskChart.getQS = resultArr.getQS.actionNumDay;
                taskChart.QStotal = resultArr.myQS.actionNumDay + resultArr.getQS.actionNumDay;
                taskChart.XStotal = resultArr.myXS.actionNumDay + resultArr.getXS.actionNumDay;
                option2.series[0].data[0].value = resultArr.myQS.actionNumDay;
                option2.series[0].data[1].value = resultArr.getQS.actionNumDay;
                option1.series[0].data[0].value = resultArr.myXS.actionNumDay;
                option1.series[0].data[1].value = resultArr.getXS.actionNumDay;
                pie1.setOption(option1);
                pie2.setOption(option2);
            }
        });
    });

    taskChart.date = (new Date()).toLocaleDateString();

    function getData() {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
            },
            isSync: true,
            url: '/me/getActionStatistics',
            success: function(ret) {
                if (ret.code == 200) {
                    resultArr = ret.data;
                    taskChart.myXS = resultArr.myXS.actionNumDay;
                    taskChart.getXS = resultArr.getXS.actionNumDay;
                    taskChart.myQS = resultArr.myQS.actionNumDay;
                    taskChart.getQS = resultArr.getQS.actionNumDay;
                    taskChart.QStotal = resultArr.myQS.actionNumDay + resultArr.getQS.actionNumDay;
                    taskChart.XStotal = resultArr.myXS.actionNumDay + resultArr.getXS.actionNumDay;
                    option2.series[0].data[0].value = resultArr.myQS.actionNumDay;
                    option2.series[0].data[1].value = resultArr.getQS.actionNumDay;
                    option1.series[0].data[0].value = resultArr.myXS.actionNumDay;
                    option1.series[0].data[1].value = resultArr.getXS.actionNumDay;
                    pie1.setOption(option1);
                    pie2.setOption(option2);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    getData();

});
