define(function(require, exports, module) {

    var Http = require('U/http');
    var directory = 'privacy';
    var UserInfo = _g.getLS('UserInfo');

    var profile = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/information-profile-main-V'),
        data: {
            totalCount: 30,
            leftCount: 30,
            profileWords: '',
            type: 9
        },
        created: function() {
            this.profileWords = UserInfo.profile;
        },
        methods: {
            isProfileInput: function() {
                var result = _g.limitInput(this.profileWords);
                this.leftCount = result.leftCount;
                this.profileWords = result.words;
            }
        },
    });

    function saveProfile() {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
                type: profile.type,
                profile: profile.profileWords
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
    //监听工作经验
    api && api.addEventListener({
        name: 'privacy-profile-save',
    }, function(ret, err) {
        saveProfile();
    });

});
