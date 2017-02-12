define(function(require, exports, module) {
    var Http = require('U/http');
    var directory = 'privacy';
    var Region = _g.getLS('Region');
    var UIActionSelector = api && api.require('UIActionSelector');
    var UserInfo = _g.getLS('UserInfo');
    // alert(_g.j2s(UserInfo))
    var regionName = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/information-region-main-V'),
        data: {
            province:'',
            city:'',
            noticeText:'请选择你所在的地区',
            type:3
        },
        // created: function() {
        //     this.province = UserInfo.address.province;
        //     this.city = UserInfo.address.city;
        //     this.noticeText = '';
        // },
        methods: {
            onRegionTap: function() {
                openRegionSelect(Region);
            }
        },
    });

    function openRegionSelect(region) {
        UIActionSelector.open({
            datas: region,
            layout: {
                row: 5,
                col: 2,
                height: 30,
                size: 12,
                sizeActive: 14,
                rowSpacing: 5,
                colSpacing: 10,
                maskBg: 'rgba(0,0,0,0.2)',
                bg: '#fff',
                color: '#888',
                colorActive: '#f00',
                colorSelected: '#f00'
            },
            animation: true,
            cancel: {
                text: '取消',
                size: 12,
                w: 90,
                h: 35,
                bg: '#fff',
                bgActive: '#ccc',
                color: '#888',
                colorActive: '#fff'
            },
            ok: {
                text: '确定',
                size: 12,
                w: 90,
                h: 35,
                bg: '#fff',
                bgActive: '#ccc',
                color: '#888',
                colorActive: '#fff'
            },
            title: {
                text: '请选择',
                size: 12,
                h: 44,
                bg: '#eee',
                color: '#888'
            },
            // fixedOn: api.frameName
        }, function(ret, err) {
            if (ret && ret.eventType == 'ok') {
                regionName.province = ret.level1;
                regionName.city = ret.level2;
                regionName.noticeText = '';
            }
            if (err) {
                alert(JSON.stringify(err));
            }
        });
    }

    function saveRegion() {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
                type: regionName.type,
                address:{
                    province: regionName.province,
                    city: regionName.city
                }
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
        name: 'privacy-region-save',
    }, function(ret, err) {
        saveRegion();
    });
});
