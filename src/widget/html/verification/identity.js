define(function(require, exports, module) {

    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var identity = new Vue({
        el: '#main',
        template: _g.getTemplate('verification/identity-main-V'),
        data: {
            name: '',
            identity: '',
            photo_1: '',
            photo_2: '',
            photo_3: '',
        },
        methods: {
            onPhotoTap: function(index) {
                _g.openPicActionSheet({
                    suc: function(ret) {
                        uploadPic(ret.base64Data, index);
                    }
                })
            },
            onPostTap: function() {
                var nameReg = /^[\u4e00-\u9fa5]{2,}$/;
                var identityReg18 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
                var identityReg15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
                if (!nameReg.test(this.name)) {
                    $('#name').focus();
                    api && api.toast({
                        msg: '请填写真实姓名!',
                        duration: 2000,
                        location: 'top'
                    });
                } else if (!identityReg15.test(this.identity) && !identityReg18.test(this.identity)) {
                    $('#identity').focus();
                    api && api.toast({
                        msg: '请填写真实身份证号码!',
                        duration: 2000,
                        location: 'top'
                    });
                } else if (this.photo_1 == '' || this.photo_2 == '' || this.photo_3 == '') {
                    api && api.toast({
                        msg: '请按指定要求上传证件照片!',
                        duration: 2000,
                        location: 'top'
                    });
                } else {
                    postData();
                }
            }
        },
    });

    function postData() {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
                name: identity.name,
                cardNumber: identity.identity,
                type:1,
                images: [identity.photo_1, identity.photo_2, identity.photo_3],
            },
            isSync: true,
            url: '/user/verificationID',
            success: function(ret) {
                if (ret.code == 200) {
                    _g.toast(ret.msg);
                    api.sendEvent({
                        name: 'me-info-getData',
                    });
                    api.closeWin();
                }
            },
            error: function(err) {}
        });
    }

    function uploadPic(data, index) {
        Http.ajax({
            data: {
                Base64: data.split(',')[1]
            },
            isSync: true,
            url: '/user/avatar',
            success: function(ret) {
                if (ret.code == 200) {
                    identity['photo_' + index] = ret.data.avatar;
                }
            },
            error: function(err) {}
        });
    }

    module.exports = {};
});
