define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var home = new Vue({
        el: '#main',
        template: _g.getTemplate('verification/confirmSuccess-main-V'),
        data: {
            name: '',
            type: 0,
            identity: '',
            time: '',
        },
        filters: {
            transType: function(value) {
                switch (Number(value)) {
                    // case 0:
                    //     return '未验证';
                    //     break;
                    case 1:
                        return '验证中';
                        break;
                    case 2:
                        return '已实名';
                        break;
                    case 3:
                        return '审核未通过';
                        break;
                    default:
                        return '未验证';
                        break;
                }
            },
            transTime: function(value) {
                if (value == '') return '';
                var d = new Date(value);
                return d.Format("yyyy-MM-dd hh:mm:ss");
            }
        },
        methods: {
            onPostTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '实名认证',
                        }
                    },
                    name: 'verification-identity',
                    url: '../verification/identity.html',
                    pageParam: {}
                });
            }
        },
    });

    function getData() {
        Http.ajax({
            data: {
                type:1,
                userID:UserInfo.userID,
            },
            isSync: true,
            url: '/user/verificationSituation',
            success: function(ret) {
                if (ret.code == 200) {
                    home.name = ret.data.name;
                    home.type = ret.data.isPass;
                    home.identity = ret.data.cardNumber;
                    home.time = ret.data.passDate.slice(0,10);
                }
            },
            error: function(err) {}
        });
    }

    getData();

    module.exports = {};
});
