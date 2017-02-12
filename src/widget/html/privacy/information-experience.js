define(function(require, exports, module) {

    var Http = require('U/http');
    var directory = 'privacy';
    var UserInfo = _g.getLS('UserInfo');

    var experience = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/information-experience-main-V'),
        data: {
            workExperience: '',
            totalCount: 30,
            leftCount: 30,
            type: 8
        },
        created: function() {
            this.workExperience = UserInfo.workExp;
        },
        methods: {
            isWorkExperienceInput:function() {
                var result = _g.limitInput(this.workExperience);
                this.leftCount = result.leftCount;
                this.workExperience = result.words;
            }
        },
    });

    function saveWorkExp() {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
                type: experience.type,
                workExp: experience.workExperience
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
        name: 'privacy-workExp-save',
    }, function(ret, err) {
        saveWorkExp();
    });
});
