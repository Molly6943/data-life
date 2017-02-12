define(function(require, exports, module) {
    if(window.innerHeight <= 480){
        $('body').attr('id', 'ios4').addClass('ios4');
    }
    var Http = require('U/http');
    api.removeLaunchView();
    var directory = 'account';
    var header = new Vue({
        el: '#header',
        template: _g.getTemplate('../html/common/header-base-V'),
        data: {
            title: '登录',
        },
        methods: {
            onTapLeftBtn: function() {
                api.closeWin();
            }
        },
    });
    var login = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/login-main-V'),
        data: {
            account: '',
            password: '',
            isCloseShow: false
        },
        ready: function() {
            // $('#main').height(api.winHeight + 'px');
            // if (api.winHeight <= 480) {
            //     $('.icon-logo').css('margin', '1.6rem auto 0.2rem');
            // }
        },
        methods: {
            onLoginTap: function() {
                if (this.account === '') {
                    _g.toast('账号不能为空');
                    return;
                }
                if (this.password === '') {
                    _g.toast('密码不能为空');
                    return;
                }
                postLogin();
            },
            onForgetTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '忘记密码'
                        }
                    },
                    name: 'account-find-pwd',
                    url: '../account/find-pwd.html',
                    pageparam: {}
                });
            },
            onCloseTap: function() {
                this.account = '';
                this.password = '';
                this.isCloseShow = false;
            },
            onPwdInput: function() {
                var pwdReg = /^[a-zA-Z0-9]{6,16}$/;
                this.isCloseShow = true;
            }
        },
    });
    function postLogin() {
        Http.ajax({
            data: {
                account: login.account,
                password: login.password
            },
            isSync: true,
            url: '/user/login',
            success: function(ret) {
                if (ret.code == 200) {
                    _g.setLS('UserInfo', ret.data.UserInfo);
                    _g.setLS('sessionID',ret.data.sessionID);
                    login.account = '';
                    login.password = '';
                    api && api.openWin({
                        name: 'main-index-win',
                        url: '../main/index.html',
                        bounces: false,
                        slidBackEnabled: false,
                    });
                }else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    module.exports = {};
});
