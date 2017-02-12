define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var directory = 'account';
    var information = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/information-main-V'),
        data: {
            selected: 1,
            id: '',
            avatar: '../../image/account/icon-avatar.png',
            name: '',
            profile: '',
            birthday: '',
            options: [{
                text: '男',
                sex: 1
            }, {
                text: '女',
                sex: 2
            }]
        },
        methods: {
            onAvatarTap: function() {
                _g.openPicActionSheet({
                    allowEdit: true,
                    suc: function(ret) {
                        postAvatar(ret.base64Data);
                    }
                });
            },
            onDateTap: function() {
                api.openPicker({
                    type: 'date',
                    title: '选择时间'
                }, function(ret, err) {
                    if (ret) {
                        var year = ret.year;
                        var month = ret.month < 10 ? '0' + ret.month : ret.month;
                        var day = ret.day < 10 ? '0' + ret.day : ret.day;
                        information.birthday = year + '年' + month + '月' + day + '日';
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            }
        }
    });

    function postAvatar(data) {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
                Base64: data.split(',')[1]
            },
            isSync: true,
            url: '/user/avatar',
            success: function(ret) {
                if (ret.code == 200) {
                    var UserInfo = _g.getLS('UserInfo');
                    information.avatar = CONFIG.HOST + ret.data.avatar;
                    _g.setLS('UserInfo', UserInfo);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function postData() {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
                update: {
                    name: information.name,
                    profile: information.profile,
                    sex: information.selected,
                    birthday: information.birthday
                }
            },
            isSync: true,
            url: '/user/repairUserInfo',
            success: function(ret) {
                if (ret.code == 200) {
                    api && api.openWin({
                        name: 'main-index-win',
                        url: '../main/index.html',
                        bounces: false,
                        slidBackEnabled: false,
                    });
                } else if (ret.code == 50105) {
                    _g.toast(ret.msg);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    //监听信息保存
    api && api.addEventListener({
        name: 'account-information-save',
    }, function(ret, err) {
        postData();
    });
});
