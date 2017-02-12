define(function(require, exports, module) {

    var directory = 'privacy';

    var recharge = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/bank-recharge-main-V'),
        data: {
            money:'',
            select:0,
            select1:0,
        },
        methods: {
            onAlipayTap: function() {
                if(this.select == 0) {
                    this.select = 1;
                    this.select1 = 0;
                }else {
                    this.select = 0;
                }
            },
            onWechatTap: function() {
                if(this.select1 == 0) {
                    this.select1 = 1;
                    this.select = 0;
                }else {
                    this.select1 = 0;
                }
            },
            onMoneyInput: function() {
                // if (this.money == '') this.isMoneyInput = false;
                // else this.isMoneyInput = true;
                if ('' + Number(this.money) == 'NaN' && this.money != '') {
                    api.alert({
                        title: '提示',
                        msg: '请输入整数金额!',
                    });
                    this.money = '';
                }
                // } else if (Number(this.money + '00') > this.wallet) {
                //     this.money = (this.wallet + '').slice(0, -2);
                // }
            }
        },
    });
});
