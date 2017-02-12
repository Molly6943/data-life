define(function(require, exports, module) {

    var directory = 'activity';
    var navigationBar = api.require('navigationBar');
    var Http = require('U/http');
    var aMap = api.require('aMap');
    var map = require('U/map');
    var UserInfo = _g.getLS('UserInfo');
    var selectedIndex = api.pageParam.selectedIndex;

    var information = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/information-main-V'),
        data: {
            showPic: true,
            showMore: false,
            isPrivacy:2,
            classType:4,
            clickAct: -1,
            actType: [{
                id: 1,
                subName: ''
            }],
            showText:true,
            thinks:'',
            list:[],
            lon: 0,
            lat: 0,
            startTime: '',
            endTime: '',
            addr: '',
            address: {
                country: '中国',
                province: '',
                city: '',
                area: '',
                addr: '',
            },
        },
        created: function() {
            var d = new Date();
            var end = d.Format("yyyy-MM-dd");
            this.endTime = end + ' ' + '23' + ':' + '59';
            var start = d.Format("yyyy-MM-dd hh:mm");
            this.startTime = start;
        },
        methods: {
            onLocationTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '所在位置'
                        }
                    },
                    name: 'activity-nearby',
                    url: '../activity/nearby.html',
                    pageparam: {}
                });
                this.showText = false;
            },
            onPrivacyTap: function() {
                if (information.isPrivacy == 1) {
                    information.isPrivacy = 2;
                    information.classType = 4;
                } else {
                    information.isPrivacy = 1;
                    information.classType = 3;
                }
            },
            choosePic: function() {
                this.showPic = false;
                this.showMore = true;
                if(this.list.length<=9) {
                    this.list = this.list;
                }else {
                    this.list.length = 9;
                }
                _g.openPicActionSheet({
                    allowEdit: true,
                    suc: function(ret) {
                        postPic(ret.base64Data);
                    }
                });
            },
        },
    });
    function getLocation() {
        map.openMap(aMap, api.winWidth, 0, 1, 1);
        aMap.getLocation(function(ret, err) {
            if (ret.status) {
                information.lon = ret.lon;
                information.lat = ret.lat;
                getCityName();
            } else {
                _g.toast('获取定位失败！');
            }
        });
    }
    getLocation();

    function getCityName(lon, lat) {
        aMap.getNameFromCoords({
            lon: lon || information.lon,
            lat: lat || information.lat
        }, function(ret, err) {
            if (ret.status) {
                setTimeout(function() {
                    information.address.province = ret.state;
                    information.address.city = ret.city;
                    information.address.area = ret.district;
                    information.address.addr = ret.street;
                }, 0);
            } else {
                alert(JSON.stringify(err));
            }
        });
    }

    function postData() {
        Http.ajax({
            data: {
                userID: UserInfo.userID,
                actType: information.actType.id,
                classType: information.classType,
                target: information.target,
                content: information.content,
                startTime: information.startTime,
                endTime: information.endTime,
                address: {
                    country: information.address.country,
                    province: information.address.province,
                    city: information.address.city,
                    area: information.address.area,
                    addr: information.address.addr,
                },
                lng: information.lon,
                lat: information.lat,
                thinks: information.thinks,
                images: information.list,
                isPrivacy: information.isPrivacy
            },
            isSync: true,
            url: '/action/postAction',
            success: function(ret) {
                if (ret.code == 200) {
                    _g.toast(ret.msg);
                    setTimeout(function() {
                        api.sendEvent({
                            name: 'main-index-mine'
                        });
                    }, 0)
                    setTimeout(function() {
                        _g.closeWins(['sharing-classification-win', 'activity-information-win'])
                    }, 1000);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function postPic(data) {
        Http.ajax({
            data: {
                Base64: data.split(',')[1],
            },
            isSync: true,
            url: '/action/saveImg',
            success: function(ret) {
                if (ret.code == 200) {
                    var image = ret.data.avatar;
                    information.list.push(image);
                    _g.toast(ret.msg);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function showMenu(data) {
        for (var i = 0; i < data.length; i++) {
            navigationBar.open({
                y: 0,
                w: api.frameWidth,
                h: 45,
                itemSize: {
                    w: 63,
                    h: 30
                },
                items: [{
                    title: data[0].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[1].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[2].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[3].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[4].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[5].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[6].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[7].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[8].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[9].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[10].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[11].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[12].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[13].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }, {
                    title: data[14].subName,
                    bg: 'widget://image/common/barItem.png',
                    bgSelected: 'widget://image/common/barItem-select.png'
                }],
                selectedIndex: selectedIndex,
                font: {
                    size: 14,
                    sizeSelected: 14,
                    color: '#fff',
                    colorSelected: '#fff'
                },
                bg: '#38373C',
                fixedOn: api.frameName
            }, function(ret, err) {
                if (ret.eventType == 'click') {
                    information.clickAct = data[ret.index].id;
                    information.actType.id = data[ret.index].id;
                }
            });
        }
    }

    function getType() {
        Http.ajax({
            data: {
                type: 2,
            },
            isSync: true,
            url: '/system/info',
            success: function(ret) {
                if (ret.code == 200) {
                    showMenu(ret.data);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    getType();

    //监听定位到的地点名称
    api && api.addEventListener({
        name: 'nearby-nearbyName',
    }, function(ret, err) {
        setTimeout(function() {
            information.addr = ret.value.name;
            information.lon = ret.value.lon;
            information.lat = ret.value.lat;
            getCityName(Number(ret.value.lon), Number(ret.value.lat));
        }, 0);
    });
    //监听右按钮发布
    api && api.addEventListener({
        name: 'activity-information-public',
    }, function(ret, err) {
        if (information.classType == 4 || information.classType == 3) {
            if (information.clickAct < 0) {
                _g.toast('还没有选择活动的类型哦~');
            }else {
                postData();
            }
        }
    });
});
