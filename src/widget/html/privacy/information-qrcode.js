define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var directory = 'privacy';

    var code = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/information-qrcode-main-V'),
        data: {
            avatar:'',
            nickName:'',
            province:'',
            city:'',
            qrcode:''
        },
        created: function() {
            this.avatar = CONFIG.HOST+UserInfo.avatar;
            this.nickName = UserInfo.name;
            this.province = UserInfo.address.province;
            this.city = UserInfo.address.city;
        },
        methods: {

        },
    });

    $('#qrcode-container').qrcode({
        "size": 230,
        "color": "#3a3",
        "background": "#fff",
        "quiet": 1,
        "text": '',
        "image": code.qrcode
    });

    function getQRcode() {
        Http.ajax({
            data: {
                userID: UserInfo.userID
            },
            isSync: true,
            url: '/user/getUserInfo',
            success: function(ret) {
                if (ret.code == 200) {
                    code.qrcode = ret.data.userInfo.QRCode;
                }else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    getQRcode();

});
