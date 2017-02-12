define(function(require, exports, module) {
    var UserInfo = _g.getLS('UserInfo');
    var directory = 'privacy';
    var Http = require('U/http');
    var companyName = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/information-company-main-V'),
        data: {
            company:'',
            type: 5
        },
        created: function() {
            this.company = UserInfo.company;
        },
        methods: {
            onCleanTap: function() {
                this.company = '';
            }
        },
    });

    function saveCompany() {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
                type: companyName.type,
                company: companyName.company
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
    //监听所在单位
    api && api.addEventListener({
        name: 'privacy-company-save',
    }, function(ret, err) {
        saveCompany();
    });
});
