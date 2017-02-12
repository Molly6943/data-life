define(function(require, exports, module) {
    var UserInfo = _g.getLS('UserInfo');
    var Http = require('U/http');
    var directory = 'privacy';
    var information = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/information-main-V'),
        data: {
            avatar: '../../image/privacy/icon-avatar.png',
            account: '',
            nickName: '',
            sex: '1',
            province: '',
            city: '',
            phone: '',
            company: '',
            industry: '',
            workyear: '',
            workExp: '',
            profile: '',
            hobby:'',
            type: 3
        },
        methods: {
            onItemTap: function(type) {
                switch (type) {
                    case 'avatar':
                        _g.openPicActionSheet({
                            allowEdit: true,
                            suc: function(ret) {
                                postAvatar(ret.base64Data);
                            }
                        });
                        break;
                    case 'nickName':
                        _g.openWin({
                            header: {
                                data: {
                                    title: '我的昵称',
                                    rightText: '保存'
                                }
                            },
                            name: 'privacy-information-nickname',
                            url: '../privacy/information-nickname.html',
                            pageparam: {}
                        });
                        break;
                    case 'sex':
                        _g.openWin({
                            header: {
                                data: {
                                    title: '我的性别',
                                    // rightText:'保存'
                                }
                            },
                            name: 'privacy-information-sex',
                            url: '../privacy/information-sex.html',
                            pageParam: {
                                sexType: this.sex
                            }
                        });
                        break;
                    case 'region':
                        // openRegionSelect(Region);
                        _g.openWin({
                            header: {
                                data: {
                                    title: '所在地',
                                    rightText: '保存'
                                }
                            },
                            name: 'privacy-information-region',
                            url: '../privacy/information-region.html',
                            pageparam: {

                            }
                        });
                        break;
                    case 'phone':
                        _g.openWin({
                            header: {
                                data: {
                                    title: '我的手机',
                                    rightText: '保存'
                                }
                            },
                            name: 'privacy-information-phone',
                            url: '../privacy/information-phone.html',
                            pageparam: {

                            }
                        });
                        break;
                    case 'company':
                        _g.openWin({
                            header: {
                                data: {
                                    title: '我的单位',
                                    rightText: '保存'
                                }
                            },
                            name: 'privacy-information-company',
                            url: '../privacy/information-company.html',
                            pageparam: {

                            }
                        });
                        break;
                    case 'hobby':
                        _g.openWin({
                            header: {
                                data: {
                                    title: '兴趣爱好',
                                    rightText: '保存'
                                }
                            },
                            name: 'privacy-information-hobby',
                            url: '../privacy/information-hobby.html',
                            pageparam: {

                            }
                        });
                        break;
                    case 'industry':
                        _g.openWin({
                            header: {
                                data: {
                                    title: '行业类别',
                                    rightText: '保存'
                                }
                            },
                            name: 'privacy-information-industry',
                            url: '../privacy/information-industry.html',
                            pageparam: {

                            }
                        });
                        break;
                    case 'workyear':
                        _g.openWin({
                            header: {
                                data: {
                                    title: '工作年限',
                                    rightText: '保存'
                                }
                            },
                            name: 'privacy-information-workyear',
                            url: '../privacy/information-workyear.html',
                            pageparam: {

                            }
                        });
                        break;
                    case 'workExp':
                        _g.openWin({
                            header: {
                                data: {
                                    title: '工作经验',
                                    rightText: '保存'
                                }
                            },
                            name: 'privacy-information-experience',
                            url: '../privacy/information-experience.html',
                            pageparam: {

                            }
                        });
                        break;
                    case 'profile':
                        _g.openWin({
                            header: {
                                data: {
                                    title: '为自己代言',
                                    rightText: '保存'
                                }
                            },
                            name: 'privacy-information-profile',
                            url: '../privacy/information-profile.html',
                            pageparam: {

                            }
                        });
                        break;
                    case 'QRcode':
                        _g.openWin({
                            header: {
                                data: {
                                    title: '我的二维码'
                                }
                            },
                            name: 'privacy-information-qrcode',
                            url: '../privacy/information-qrcode.html',
                            pageparam: {

                            }
                        });
                        break;
                }
            }
        },
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
                    api && api.sendEvent({
                        name: 'updateAvatar',
                    });
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function changeValue(result) {
        switch (result) {
            case '1':
                return '男';
                break;
            case '2':
                return '女';
                break;
        }
    }

    function getData() {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
            },
            lock: false,
            isSync: true,
            url: '/user/getUserInfo',
            success: function(ret) {
                if (ret.code == 200) {
                    setTimeout(function() {
                        var item = ret.data.userInfo;
                        information.account = item.account || '';
                        information.avatar = CONFIG.HOST + item.avatar || '';
                        information.nickName = item.name || '';
                        information.sex = changeValue(item.sex) || '';
                        information.profile = item.profile || '';
                        information.province = item.address.province || '';
                        information.city = item.address.city || '';
                        information.phone = item.phone || '';
                        information.company = item.company || '';
                        information.industry = item.industry || '';
                        information.workyear = item.workAge || '';
                        information.workExp = item.workExp || '';
                        information.hobby = item.hobbies || '';
                    }, 0);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    getData();
    //更新数据
    api && api.addEventListener({
        name: 'updateInfo'
    }, function() {
        getData();
    });
});
