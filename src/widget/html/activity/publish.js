define(function(require, exports, module) {
    var navigationBar = api.require('navigationBar');
    var Http = require('U/http');
    var directory = 'activity';
    var aMap = api.require('aMap');
    var map = require('U/map');
    var UserInfo = _g.getLS('UserInfo');
    var selectedIndex = api.pageParam.selectedIndex;

    var type1 = api.pageParam.type1;
    var publishAcitvity = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/publish-main-V'),
        data: {
            showPrivacy: true,
            showText: true,
            giveMoney: false,
            getMoney: false,
            isXSMoney: 0,
            isQSMoney: 0,
            showPic: true,
            showMore: false,
            actType: [{
                id: 1,
                subName: ''
            }],
            classType: 1,
            target: '',
            content: '',
            startTime: '',
            endTime: '',
            endTime2: '',
            start: '00：00',
            end: '00：00',
            lon: 0,
            lat: 0,
            addr: '',
            address: {
                country: '中国',
                province: '',
                city: '',
                area: '',
                addr: '',
            },
            XSMoney: 0,
            DSMoney: 0,
            QSMoney: 0,
            DJMoney: 0,
            thinks: '',
            isPrivacy: 2,
            list: [],

        },
        created: function() {
            var d = new Date();
            var date = d.Format("yyyy-MM-dd");
            this.endTime2 = date + ' ' + '23' + ':' + '59';
            if (type1 == 1) {
                this.isXSMoney = 1;
                this.giveMoney = true;
                this.showPrivacy = false;
                this.classType = 1;
            }
        },
        methods: {
            chooseTime: function(event) {
                api.openPicker({
                    type: 'time',
                    title: '选择时间'
                }, function(ret, err) {
                    var action = $(event.target).attr('data-action');
                    if (ret) {
                        var year = ret.year;
                        var month = ret.month < 10 ? '0' + ret.month : ret.month;
                        var day = ret.day < 10 ? '0' + ret.day : ret.day;
                        var hour = ret.hour < 10 ? '0' + ret.hour : ret.hour;
                        var min = ret.minute < 10 ? '0' + ret.minute : ret.minute;
                        if (action == 'startTime') {
                            publishAcitvity.startTime = year + '-' + month + '-' + day + ' ' + hour + ':' + min;
                            publishAcitvity.start = ret.hour + '时' + ret.minute + '分';
                        } else if (action == 'endTime') {
                            publishAcitvity.endTime = year + '-' + month + '-' + day + ' ' + hour + ':' + min;
                            publishAcitvity.end = ret.hour + '时' + ret.minute + '分';
                        }
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            },
            openNearby: function() {
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
            // onPrivacyTap: function() {
            //     if (publishAcitvity.isPrivacy == 1) {
            //         publishAcitvity.isPrivacy = 2;
            //         publishAcitvity.classType = 4;
            //     } else {
            //         publishAcitvity.isPrivacy = 1;
            //         publishAcitvity.classType = 3;
            //     }
            // },
            choosePic: function() {
                this.showPic = false;
                this.showMore = true;
                if (this.list.length <= 9) {
                    this.list = this.list;
                } else {
                    this.list.length = 9;
                }
                _g.openPicActionSheet({
                    allowEdit: true,
                    suc: function(ret) {
                        postPic(ret.base64Data);
                    }
                });
            },
            onXSMoneyTap: function() {
                publishAcitvity.isXSMoney = 1;
                publishAcitvity.isQSMoney = 0;
                publishAcitvity.giveMoney = true;
                publishAcitvity.getMoney = false;
                publishAcitvity.showPrivacy = false;
                publishAcitvity.classType = 1;
            },
            onQSMoneyTap: function() {
                publishAcitvity.isQSMoney = 1;
                publishAcitvity.isXSMoney = 0;
                publishAcitvity.getMoney = true;
                publishAcitvity.giveMoney = false;
                publishAcitvity.showPrivacy = false;
                publishAcitvity.classType = 2;
            }
        },
    });

    function getLocation() {
        map.openMap(aMap, api.winWidth, 0, 1, 1);
        aMap.getLocation(function(ret, err) {
            if (ret.status) {
                publishAcitvity.lon = ret.lon;
                publishAcitvity.lat = ret.lat;
                getCityName();
            } else {
                _g.toast('获取定位失败！');
            }
        });
    }
    getLocation();

    function getCityName(lon, lat) {
        aMap.getNameFromCoords({
            lon: lon || publishAcitvity.lon,
            lat: lat || publishAcitvity.lat
        }, function(ret, err) {
            if (ret.status) {
                setTimeout(function() {
                    publishAcitvity.address.province = ret.state;
                    publishAcitvity.address.city = ret.city;
                    publishAcitvity.address.area = ret.district;
                    publishAcitvity.address.addr = ret.street;
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
                actType:publishAcitvity.actType.id || selectedIndex+1,
                classType: publishAcitvity.classType,
                target: publishAcitvity.target,
                content: publishAcitvity.content,
                startTime: publishAcitvity.startTime,
                endTime: publishAcitvity.endTime || publishAcitvity.endTime2,
                address: {
                    country: publishAcitvity.address.country,
                    province: publishAcitvity.address.province,
                    city: publishAcitvity.address.city,
                    area: publishAcitvity.address.area,
                    addr: publishAcitvity.address.addr,
                },
                lng: publishAcitvity.lon,
                lat: publishAcitvity.lat,
                XSMoney: publishAcitvity.XSMoney * 100,
                DJMoney: publishAcitvity.DJMoney * 100,
                QSMoney: publishAcitvity.QSMoney * 100,
                DSMoney: publishAcitvity.DSMoney * 100,
                thinks: publishAcitvity.thinks,
                images: publishAcitvity.list,
                isPrivacy: publishAcitvity.isPrivacy
            },
            isSync: true,
            url: '/action/postAction',
            success: function(ret) {
                if (ret.code == 200) {
                    _g.toast(ret.msg);
                    setTimeout(function() {
                        api.sendEvent({
                            name: 'main-index-message'
                        });
                    }, 0)
                    setTimeout(function() {
                        _g.closeWins(['sharing-classification-win', 'activity-publish-win'])
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
                    publishAcitvity.list.push(image);
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
                    publishAcitvity.actType.id = data[ret.index].id;
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
            publishAcitvity.addr = ret.value.name;
            publishAcitvity.lon = ret.value.lon;
            publishAcitvity.lat = ret.value.lat;
            getCityName(Number(ret.value.lon), Number(ret.value.lat));
        }, 0);
    });
    //监听右按钮发布
    api && api.addEventListener({
        name: 'activity-publish-public',
    }, function(ret, err) {
         if (publishAcitvity.classType == 1 || publishAcitvity.classType == 2) {
            if (typeof publishAcitvity.actType.id == "undefined" && typeof selectedIndex == "undefined") {
                _g.toast('还没有选择活动的类型哦~');
            } else if (publishAcitvity.content == '') {
                _g.toast('还没有填写活动的内容哦~');
            } else if (publishAcitvity.startTime == '') {
                _g.toast('还没有填写活动的开始时间哦~');
            } else if (publishAcitvity.endTime == '') {
                _g.toast('还没有填写活动的结束时间哦~');
            } else if (publishAcitvity.address.country == '' || publishAcitvity.address.province == '' || publishAcitvity.address.city == '' || publishAcitvity.address.addr == '') {
                _g.toast('还没有填写活动的地点哦~');
            } else if (publishAcitvity.thinks == '') {
                _g.toast('还没有填写活动的想法哦~');
            } else {
                postData();
            }
        }
    });
});
