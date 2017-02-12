define(function(require, exports, module) {
    var Http = require('U/http');
    var directory = 'privacy';
    var UserInfo = _g.getLS('UserInfo');
    var nickname = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/information-nickname-main-V'),
        data: {
            nickName: '',
            type:1
        },
        created: function() {
            this.nickName = UserInfo.name;
        },
        methods: {
            onCleanTap: function() {
                this.nickName = '';
            }
        },
    });
    function saveName() {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
                type: nickname.type,
                name: nickname.nickName
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
    //监听昵称保存
    api && api.addEventListener({
        name: 'privacy-nickname-save',
    }, function(ret, err) {
        saveName();
    });
});
