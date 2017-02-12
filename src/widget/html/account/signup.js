define(function(require, exports, module) {
    if (window.innerHeight <= 480) {
        $('body').attr('id', 'ios4').addClass('ios4');
    }
    var Http = require('U/http');
    var directory = 'account';
    var header = new Vue({
        el: '#header',
        template: _g.getTemplate('../html/common/header-base-V'),
        data: {
            title: '注册'
        },
        methods: {
            onTapLeftBtn: function() {
                api.closeWin();
            }
        },
    });

    var signup = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/signup-main-V'),
        data: {
            account: '',
            password: '',
            isCloseShow: false
        },
        methods: {
            onInformationTap: function() {
                Http.ajax({
                    data: {
                        account: this.account,
                        password: this.password
                    },
                    isSync: true,
                    url: '/user/regist',
                    success: function(ret) {
                        if (ret.code == 200) {
                            _g.setLS('UserInfo', ret.data.UserInfo);
                            _g.setLS('sessionID', ret.data.sessionID);
                            api.alert({
                                title: '提示',
                                msg: '注册成功',
                            }, function(ret, err) {
                                _g.openWin({
                                    header: {
                                        data: {
                                            title: '补全信息',
                                            rightText: '保存'
                                        }
                                    },
                                    name: 'account-information',
                                    url: '../account/information.html',
                                    bounces: false,
                                    slidBackEnabled: false,
                                });
                            });
                        } else if (ret.code == 50100) {
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {}
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
            },
            onAccountInput: function() {
                var phoneReg = /^1[0-9]{10}$/;
                if (phoneReg.test(this.account)) {
                    Http.ajax({
                        data: {
                            account: signup.account
                        },
                        // isSync: true,
                        url: '/user/checkAccount',
                        success: function(ret) {
                            if (ret.code == 200) {
                                _g.toast(ret.msg);
                            } else if (ret.code == 50100) {
                                _g.toast(ret.msg);
                            } else {
                                _g.toast(ret.msg);
                            }
                        },
                        error: function(err) {}
                    });
                } else {
                    return;
                }
            }
        },
    });
});
