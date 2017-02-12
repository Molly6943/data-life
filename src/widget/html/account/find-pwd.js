define(function(require, exports, module) {
    var Http = require('U/http');
    var Vcode = require('U/vcode');
    var directory = 'account';

    var findPwd = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/find-pwd-main-V'),
        data: {
            account: '',
            code: '',
            codeText: ''
        },
        created: function() {
            Vcode.init({
                onInit: this.onInit,
                onAction: this.onAction
            });
        },
        methods: {
            onInit: function(nowText) {
                this.codeText = nowText;
            },
            onAction: function(nowText) {
                this.codeText = nowText;
            },
            sendCode: function() {
            
                Http.ajax({
                    data: {
                        account: this.account,
                    },
                    isSync: true,
                    url: '/user/vcode',
                    success: function(ret) {
                        if (ret.code == 200) {
                            _g.toast(ret.msg);
                        } else {
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {}
                });
            },
            onNextTap: function() {
                if (this.account == '') {
                    _g.toast('手机号不能为空');
                    return;
                }
                if (this.code == '') {
                    _g.toast('验证码不能为空');
                    return;
                }
                Http.ajax({
                    data: {
                        account: this.account,
                        password: this.password,
                        vcode: this.code,
                    },
                    isSync: true,
                    url: '/user/forgetPwd',
                    success: function(ret) {
                        if (ret.code == 200) {
                            _g.toast(ret.msg);
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
