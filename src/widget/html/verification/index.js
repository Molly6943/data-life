define(function(require, exports, module) {

    var directory = 'verification';
    new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/index-main-V'),
        data: {},
        methods: {
            onBusinessTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '商家验证'
                        }
                    },
                    name: 'verification-business',
                    url: '../verification/business.html',
                    pageparam: {

                    }
                });
            },
            onIdentityTap: function() {
                var UserInfo = _g.getLS('UserInfo');
                if(UserInfo.isDefined == 0) {
                    _g.openWin({
                        header: {
                            data: {
                                title: '身份验证'
                            }
                        },
                        name: 'verification-identity',
                        url: '../verification/identity.html',
                        pageparam: {

                        }
                    });
                }else{
                    _g.openWin({
                        header: {
                            data: {
                                title: '我的实名'
                            }
                        },
                        name: 'verification-confirmSuccess',
                        url: '../verification/confirmSuccess.html',
                        pageparam: {

                        }
                    });
                }
            },
        },
    });
});
