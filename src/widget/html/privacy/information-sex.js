define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    // var sexType = api && api.pageParam.sexType;
    var directory = 'privacy';

    var sex = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/information-sex-main-V'),
        data: {
            type:2,
            isMan: false,
        },
        ready: function() {
            if (UserInfo.sex == 1) {
                this.isMan = true;
            } else {
                this.isMan = false;
            }
        },
        methods: {
            sexTap: function(Type) {
                if (Type == 1) {
                    this.isMan = true;
                } else {
                    this.isMan = false;
                }
                Http.ajax({
                    data: {
                        userID: UserInfo.userID,
                        type: this.type,
                        sex: Type
                    },
                    isSync: true,
                    url: '/user/updateUserInfo',
                    success: function(ret) {
                        if (ret.code == 200) {
                            _g.setLS('UserInfo', ret.data);
                            api.sendEvent({
                                name: 'updateInfo'
                            });
                            api && api.closeWin();
                        } else {
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {}
                });
            },
        },
    });

});
