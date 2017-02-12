define(function(require, exports, module) {

    var directory = 'privacy';
    var Http = require('U/http');
    var label = api.pageParam.label;
    var actionID = api.pageParam.actionID;
    var startTime = api.pageParam.startTime;
    var endTime = api.pageParam.endTime;
    var startTime1 = new Date().Format('yyyy-MM-dd')+' '+startTime;
    var endTime1 = new Date().Format('yyyy-MM-dd')+' '+endTime;

    var record = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/bank-record-main-V'),
        data: {
            actionID:0,
            label:'',
            startTime:'',
            endTime:'',
            starttime:'7777',
            endtime:'888',
        },
        created: function() {
            this.label = label;
            this.actionID = actionID;
            this.starttime = startTime;
            this.endtime = endTime;
        },
        methods: {
            onRecordTap: function() {
                _g.openWin({
                    header:{
                        data:{
                            title:'再记一笔'
                        }
                    },
                    name:'privacy-bank-main',
                    url:'../privacy/bank.html',
                    bounces:true,
                    slidBackEnabled:false,
                });
            },
            onTimeTap: function(type) {
                api.openPicker({
                    type: 'time',
                    title: '选择时间'
                }, function(ret, err) {
                    if (ret) {
                        var year = ret.year;
                        var month = ret.month < 10 ? '0' + ret.month : ret.month;
                        var day = ret.day < 10 ? '0' + ret.day : ret.day;
                        var hour = ret.hour < 10 ? '0' + ret.hour : ret.hour;
                        var min = ret.minute < 10 ? '0' + ret.minute : ret.minute;
                        if (type == 1) {
                            record.startTime = year + '-' + month + '-' + day + ' ' + hour + ':' + min;
                            record.starttime = ret.hour + ':' + ret.minute;
                        } else if (type == 2) {
                            record.endTime = year + '-' + month + '-' + day + ' ' + hour + ':' + min;
                            record.endtime = ret.hour + ':' + ret.minute;
                        }
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            },
            onSaveTap:function() {
                Http.ajax({
                    data: {
                        actionID: actionID,
                        startTime: record.startTime || startTime1,
                        endTime: record.endTime || endTime1,
                    },
                    isSync: true,
                    url: '/action/writeNote',
                    success: function(ret) {
                        if (ret.code == 200) {
                            _g.toast(ret.msg);
                            api.sendEvent({
                                name:'privacy-trace-getData'
                            });
                            api.closeWin();
                        } else {
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {}
                });
            }
        },
    });
});
