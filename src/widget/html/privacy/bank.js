define(function(require, exports, module) {

    var directory = 'privacy';
    var Http = require('U/http');
    var bank = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/bank-main-V'),
        data: {
            bankTab: 0,
            rmbTab: 0,
            rsbTab: 0,
            current:0,
            setReward:0,
            giveReward:0,
            seekReward:0,
            Deposit:0,
            alreadyMoney:0,
            group:0,
            promotion:0,
            accumulate:0,
            digital:0,
            advertisement:0,
            date:'',
        },
        computed: {
            showBankTab0: function() {
                return this.bankTab === 0 ? true : false;
            },
            showBankTab1: function() {
                return this.bankTab === 1 ? true : false;
            },
            showRmbBar: function() {
                return this.rmbTab === 0 ? true : false;
            },
            showRmbPie: function() {
                return this.rmbTab === 1 ? true : false;
            },
            showRmbList: function() {
                return this.rmbTab === 2 ? true : false;
            },
        },
        methods: {
            changeBankTab: function(index) {
                this.bankTab = index;
            },
            changeRmbTab: function(index) {
                this.rmbTab = index;
            },
            onPayPageTap:function(){
                _g.openWin({
                    header:{
                        data:{
                            title:'充值'
                        }
                    },
                    name:'privacy-bank-recharge',
                    url:'../privacy/bank-recharge.html',
                    bounces:true,
                    slidBackEnabled:false,
                });
            },
            onBankCashTap:function(){
                _g.openWin({
                    header:{
                        data:{
                            title:'提现'
                        }
                    },
                    name:'privacy-bank-cash',
                    url:'../privacy/bank-cash.html',
                    bounces:true,
                    slidBackEnabled:false,
                });
            },
            onBankTotalTap:function(){
                _g.openWin({
                    header:{
                        data:{
                            title:'账单明细'
                        }
                    },
                    name:'privacy-bank-statistics',
                    url:'../privacy/bank-statistics.html',
                    bounces:true,
                    slidBackEnabled:false,
                });
            },
        },
    });

    var rmbBar1 = echarts.init(document.getElementById('rmb-bar-1'));

    var barOption1 = {
        grid: {
            left: '0',
            right: '8%',
            bottom: '0',
            top: '20%',
            containLabel: true
        },
        xAxis: [{
            show: false,
            type: 'category',
            data: []
        }],
        yAxis: [{
            show: false,
            type: 'value'
        }],
        series: [{
            type: 'bar',
            barWidth: '60%',
            data: [
                { value: 400, name: '当前余额', itemStyle: { normal: { color: '#F5694B' } } },
                { value: 335, name: '悬赏金额', itemStyle: { normal: { color: '#FEAE08' } } },
                { value: 310, name: '打赏金额', itemStyle: { normal: { color: '#06AD92' } } },
                { value: 274, name: '求赏金额', itemStyle: { normal: { color: '#87CB14' } } },
                { value: 235, name: '定金金额', itemStyle: { normal: { color: '#13E1C7' } } },
                { value: 235, name: '待收金额', itemStyle: { normal: { color: '#BB2FD8' } } }
            ]
        }]
    }
    rmbBar1.setOption(barOption1);

    var rmbBar2 = echarts.init(document.getElementById('rmb-bar-2'));

    var barOption2 = {
        grid: {
            left: '0',
            right: '8%',
            bottom: '0',
            top: '20%',
            containLabel: true
        },
        xAxis: [{
            show: false,
            type: 'category',
            data: []
        }],
        yAxis: [{
            show: false,
            type: 'value'
        }],
        series: [{
            type: 'bar',
            barWidth: '60%',
            data: [
                // { value: 400, name: '注册金额', itemStyle: { normal: { color: '#F5694B' } } },
                // { value: 335, name: '注册红包', itemStyle: { normal: { color: '#FEAE08' } } },
                { value: 310, name: '团购返利', itemStyle: { normal: { color: '#06AD92' } } },
                { value: 274, name: '推广返利', itemStyle: { normal: { color: '#87CB14' } } },
                { value: 235, name: '累计返利', itemStyle: { normal: { color: '#13E1C7' } } },
                { value: 235, name: '数据返利', itemStyle: { normal: { color: '#BB2FD8' } } },
                { value: 235, name: '广告返利', itemStyle: { normal: { color: '#5C77C9' } } }
            ]
        }]
    }

    rmbBar2.setOption(barOption2);

    var rmbPie1 = echarts.init(document.getElementById('rmb-pie-1'));

    var pieOption1 = {
        legend: {
            orient: 'vertical',
            x: 'left',
            data: ['当前余额', '悬赏金额', '打赏金额', '求赏金额', '定金金额', '待收金额']
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
            data: [
                { value: 400, name: '当前余额', itemStyle: { normal: { color: '#F5694B' } } },
                { value: 335, name: '悬赏金额', itemStyle: { normal: { color: '#FEAE08' } } },
                { value: 310, name: '打赏金额', itemStyle: { normal: { color: '#06AD92' } } },
                { value: 274, name: '求赏金额', itemStyle: { normal: { color: '#87CB14' } } },
                { value: 235, name: '定金金额', itemStyle: { normal: { color: '#13E1C7' } } },
                { value: 235, name: '待收金额', itemStyle: { normal: { color: '#BB2FD8' } } }
            ]
        }]
    }
    rmbPie1.setOption(pieOption1);

    var rmbPie2 = echarts.init(document.getElementById('rmb-pie-2'));

    var pieOption2 = {
        legend: {
            orient: 'vertical',
            x: 'left',
            data: ['当前余额', '悬赏金额', '打赏金额', '求赏金额', '定金金额', '待收金额']
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
            data: [
                // { value: 400, name: '注册金额', itemStyle: { normal: { color: '#F5694B' } } },
                // { value: 335, name: '注册红包', itemStyle: { normal: { color: '#FEAE08' } } },
                { value: 310, name: '团购返利', itemStyle: { normal: { color: '#06AD92' } } },
                { value: 274, name: '推广返利', itemStyle: { normal: { color: '#87CB14' } } },
                { value: 235, name: '累计返利', itemStyle: { normal: { color: '#13E1C7' } } },
                { value: 235, name: '数据返利', itemStyle: { normal: { color: '#BB2FD8' } } },
                { value: 235, name: '广告返利', itemStyle: { normal: { color: '#5C77C9' } } }
            ]
        }]
    }

    rmbPie2.setOption(pieOption2);

    function getData() {
        Http.ajax({
            data: {},
            isSync: true,
            lock:false,
            url: '/action/myBank',
            success: function(ret) {
                if (ret.code == 200) {
                    setTimeout(function() {
                        var data = ret.data;
                        bank.current = data.currentM;
                        bank.setReward = data.setReward;
                        bank.giveReward = data.giverReward;
                        bank.seekReward = data.seekReward;
                        bank.Deposit = data.Deposit;
                        bank.alreadyMoney = data.alreadyMoney;
                        barOption1.series[0].data[0].value = data.currentM;
                        barOption1.series[0].data[1].value = data.setReward;
                        barOption1.series[0].data[2].value = data.giverReward;
                        barOption1.series[0].data[3].value = data.seekReward;
                        barOption1.series[0].data[4].value = data.Deposit;
                        barOption1.series[0].data[5].value = data.alreadyMoney;
                        rmbBar1.setOption(barOption1);
                        pieOption1.series[0].data[0].value = data.currentM;
                        pieOption1.series[0].data[1].value = data.setReward;
                        pieOption1.series[0].data[2].value = data.giverReward;
                        pieOption1.series[0].data[3].value = data.seekReward;
                        pieOption1.series[0].data[4].value = data.Deposit;
                        pieOption1.series[0].data[5].value = data.alreadyMoney;
                        rmbPie1.setOption(pieOption1);
                    }, 0);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    getData();

    function getRebateData(){
        Http.ajax({
            data: {},
            isSync: true,
            lock:false,
            url: '/action/myRebate',
            success: function(ret) {
                if (ret.code == 200) {
                    setTimeout(function() {
                        var data = ret.data;
                        bank.group = data.group;
                        bank.promotion = data.promotion;
                        bank.digital = data.digital;
                        bank.advertisement = data.advertisement;
                        bank.accumulate = data.accumulate;
                        barOption2.series[0].data[0].value = data.group;
                        barOption2.series[0].data[1].value = data.promotion;
                        barOption2.series[0].data[2].value = data.digital;
                        barOption2.series[0].data[3].value = data.advertisement;
                        barOption2.series[0].data[4].value = data.accumulate;
                        rmbBar2.setOption(barOption2);
                        pieOption2.series[0].data[0].value = data.group;
                        pieOption2.series[0].data[1].value = data.promotion;
                        pieOption2.series[0].data[2].value = data.digital;
                        pieOption2.series[0].data[3].value = data.advertisement;
                        pieOption2.series[0].data[4].value = data.accumulate;
                        rmbPie2.setOption(pieOption2);
                    }, 0);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    getRebateData();

    api.addEventListener({
        name: 'privacy-bank-openMenu'
    }, function(ret, err) {
        var datas = {};
        if (bank.bankTab == 0) {
            api.actionSheet({
                cancelTitle: '取消',
                buttons: ['支付设置','本年统计','本季统计','本周统计','今天统计'],
                style: {
                    layerColor: '', //遮蔽层颜色，仅支持 rgba颜色，默认值：rgba（0, 0, 0, 0.4）
                    itemNormalColor: '#F0F0F0', //选项按钮正常状态背景颜色，支持#000、#000000、rgb、rgba，默认值：#F1F1F1
                    itemPressColor: '#F0F0F0', //选项按钮按下时背景颜色，支持#000、#000000、rgb、rgba，默认值：#E6E6E6
                    fontNormalColor: '#3D3D3D', //选项按钮正常状态文字颜色，支持#000、#000000、rgb、rgba，默认值：#007AFF
                    fontPressColor: '#3D3D3D', //选项按钮按下时文字颜色，支持#000、#000000、rgb、rgba，默认值：#0060F0
                    titleFontColor: '' //标题文字颜色，支持#000、#000000、rgb、rgba，默认值：#8F8F8F
                }
            }, function(ret, err) {
                if(ret.buttonIndex == 1){
                    _g.openWin({
                        header:{
                            data:{
                                title:'支付设置'
                            }
                        },
                        name:'privacy-bank-setting',
                        url:'../privacy/bank-setting.html',
                        bounces:true,
                        slidBackEnabled:false
                    });
                }else {
                    _g.openWin({
                        header:{
                            data:{
                                title:'金额统计'
                            }
                        },
                        name:'privacy-bank-chart',
                        url:'../privacy/bank-chart.html',
                        bounces:true,
                        slidBackEnabled:false,
                        pageParam:{
                            index:ret.buttonIndex,
                        }
                    });
                }
            });
        }
    });
});
