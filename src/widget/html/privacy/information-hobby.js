define(function(require, exports, module) {
    var Http = require('U/http');
    var directory = 'privacy';
    var UserInfo = _g.getLS('UserInfo');
    var hobby = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/information-hobby-main-V'),
        data: {
            hobby: '',
            type:10
        },
        created: function() {
            this.hobby = UserInfo.hobbies;
        },
        methods: {
            onCleanTap: function() {
                this.hobby = '';
            }
        },
    });
    function saveHobby() {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
                type: hobby.type,
                hobbies: hobby.hobby
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
        name: 'privacy-hobby-save',
    }, function(ret, err) {
        saveHobby();
    });
});
