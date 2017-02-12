define(function(require, exports, module) {
    var Http = require('U/http');
    var directory = 'privacy';
    var UserInfo = _g.getLS('UserInfo');

    var phoneNumber = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/information-phone-main-V'),
        data: {
            phone:'',
            type: 4
        },
        created: function() {
            this.phone = UserInfo.phone;
        },
        methods: {
            onCleanTap: function() {
                this.phone = '';
            }
        },
    });
    function savePhone() {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
                type: phoneNumber.type,
                phone: phoneNumber.phone
            },
            isSync: true,
            url: '/user/updateUserInfo',
            success: function(ret) {
                if (ret.code == 200) {
                    _g.setLS('UserInfo',ret.data);
                    api.sendEvent({
                        name:'updateInfo'
                    });
                    api&&api.closeWin();
                }else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    //监听手机号码保存
    api && api.addEventListener({
        name: 'privacy-phone-save',
    }, function(ret, err) {
        savePhone();
    });
});
