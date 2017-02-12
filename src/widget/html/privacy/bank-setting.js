define(function(require, exports, module) {

    var directory = 'privacy';

    new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/bank-setting-main-V'),
        data: {
        },
        methods: {
        	onBankPwdTap:function(){
        		_g.openWin({
        			header:{
        				data:{
        					title:'设置密码'
        				}
        			},
        			name:'privacy-bank-password',
        			url:'../privacy/bank-password.html',
        			bounces:true,
        			slidBackEnabled:false
        		});
        	}
        },
    });
});
