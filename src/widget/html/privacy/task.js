define(function(require, exports, module) {

    var directory = 'privacy';

    var task = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/task-main-V'),
        data: {},
        methods: {
            onTaskChartTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '任务统计'
                        },
                        template: 'main/menu-header-V'
                    },
                    name: 'privacy-taskChart',
                    url: '../privacy/task-chart.html',
                    bounces: true,
                    slidBackEnabled: false
                });
            },
            onTaskListTap: function(type) {
                if (type == 'type1') {
                    var title = '发布任务';
                    var param = 1;
                } else if (type == 'type2') {
                    var title = '接受任务';
                    var param = 2;
                }
                _g.openWin({
                    header: {
                        data: {
                            title: title
                        },
                    },
                    pageParam: {
                        type: param
                    },
                    name: 'privacy-taskList',
                    url: '../privacy/taskList.html',
                    bounces: true,
                    slidBackEnabled: false
                });
            }
        },
    });
});
