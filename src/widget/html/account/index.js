define(function(require, exports, module) {
    api.removeLaunchView();
    var directory = 'account';
    
    new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/index-main-V'),
        data: {
        },
        methods: {
        	onLoginPageTap:function(){
        		api.openWin({
                    name:'account-login',
                    url:'../account/login.html',
                    bounces: false,
                    slidBackEnabled: false,
        		});
        	},
            onSignupPageTap:function(){
                api.openWin({
                    name:'account-signup',
                    url:'../account/signup.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            }
        },
    });
});
