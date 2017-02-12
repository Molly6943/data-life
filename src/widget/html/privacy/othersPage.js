define(function(require, exports, module) {
    var UserInfo = _g.getLS('UserInfo');
    var directory = 'privacy';
    var Http = require('U/http');
    var aMap = api.require('aMap');
    var map = require('U/map');
    var userID = api.pageParam.userID;
    var others = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/othersPage-main-V'),
        data: {
            userID: '',
            avatar: '',
            account: '',
            nickName: '',
            age: 0,
            sex: '',
            birthday: '',
            images: [],
            province: '',
            city: '',
            startLon: 0,
            startLat: 0,
            endLon: 0,
            endLat: 0,
            distance: '',
            timeText: '',
            xingZuo: '',
            stars: [{
                pic: '../../image/privacy/task/start2.png'
            }, {
                pic: '../../image/privacy/task/start2.png'
            }, {
                pic: '../../image/privacy/task/start2.png'
            }, {
                pic: '../../image/privacy/task/start2.png'
            }, {
                pic: '../../image/privacy/task/start2.png'
            }, {
                pic: '../../image/privacy/task/start2.png'
            }, ]
        },
        methods: {
            onChatTap: function() {

            },
            onAttentionTap: function() {
                Http.ajax({
                    data: {
                        userID: UserInfo.userID,
                        favUserID: userID,
                    },
                    isSync: true,
                    url: '/user/setAttention',
                    success: function(ret) {
                        if (ret.code == 200) {
                            _g.toast(ret.msg);
                        } else {
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {}
                });
            },
            onOthersMomentTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: others.nickName,
                        }
                    },
                    name: 'message-mine',
                    url: '../message/mine.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {
                        userID: others.userID,
                        collectType:6,
                    }
                });
            }
        },
    });

    function getData() {
        Http.ajax({
            data: {
                otherID: userID,
            },
            lock: false,
            isSync: true,
            url: '/user/otherInfo',
            success: function(ret) {
                if (ret.code == 200) {
                    setTimeout(function() {
                        var item = ret.data.userInfo;
                        var item2 = ret.data.actionInfo;
                        others.userID = item.userID || 0;
                        others.account = item.account || '';
                        others.avatar = item.avatar || '';
                        others.nickName = item.name || '';
                        others.sex = item.sex || '';
                        others.province = item.address.province;
                        others.city = item.address.city;
                        others.endLon = item2.lng;
                        others.endLat = item2.lat;
                        //展示星星
                        if (item2.credit > 0) {
                            _.each(others.stars, function(n, i) {
                                if (i <= item2.credit - 1) {
                                    n.pic = '../../image/message/index-star.png';
                                }
                            });
                        }
                        //判断限制相册的长度
                        if (item2.moment.length <= 3) {
                            others.images = item2.moment;
                        } else {
                            item2.moment.length = 3;
                            others.images = item2.moment;
                        }
                        //星座和年龄
                        if (item.birthday == '') {
                            others.age = 0;
                        } else {
                            var m = item.birthday.slice(5, 7);
                            var d = item.birthday.slice(8, 10);
                            others.xingZuo = getAstro(m, d);
                            var y = item.birthday.slice(0, 4);
                            var birthday = y + '.' + m + '.' + d;
                            others.age = getAge(birthday);
                        }
                        getLocation();
                    }, 0);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    getData();

    function getLocation() {
        map.openMap(aMap, api.winWidth, 0, 1, 1);
        aMap.getLocation(function(ret, err) {
            if (ret.status) {
                others.startLon = ret.lon;
                others.startLat = ret.lat;
                getDistance();
                getTime();
            } else {
                _g.toast('定位失败,请开启定位!');
            }
        });
    }

    //根据两点间的不同经纬度算两点距离
    function getDistance() {
        aMap.getDistance({
            start: {
                lon: others.startLon,
                lat: others.startLat
            },
            end: {
                lon: others.endLon,
                lat: others.endLat
            }
        }, function(ret, err) {
            if (ret.status) {
                if (ret.distance == 0) {
                    others.distance = ret.distance + '米';
                } else if (ret.distance > 0) {
                    var needDistance = ret.distance / 1000;
                    if (needDistance >= 1) {
                        others.distance = parseInt(needDistance) + '公里';
                    } else {
                        others.distance = ret.distance + '米';
                    }
                }
            } else {

            }
        });
    }
    //根据不同的经纬度算到达对方地点的时间
    function getTime() {
        aMap.searchRoute({
            id: 1,
            type: 'drive',
            policy: 'drive_time_first',
            start: {
                lon: others.startLon,
                lat: others.startLat
            },
            end: {
                lon: others.endLon,
                lat: others.endLat
            },
            city: '广州',
            nightflag: false,
            waypoints: []
        }, function(ret, err) {
            if (ret.status) {
                // api.alert({
                //     msg: JSON.stringify(ret)
                // });
                var duration = ret.paths[0].duration;
                // alert(duration)
                var durationMin = (duration / 60);
                others.timeText = durationMin + '分钟';
                // if(durationMin >= 60) {
                //
                // }
            }
        });
    }


    //根据出生日期算星座
    function getAstro(m, d) {
        return "魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯".substr(m * 2 - (d < "102223444433".charAt(m - 1) - -19) * 2, 2);
    }

    //根据出生日期算年龄
    function getAge(birthday) {
        var returnAge;
        var strBirthdayArr = birthday.split(".");
        var birthYear = strBirthdayArr[0];
        var birthMonth = strBirthdayArr[1];
        var birthDay = strBirthdayArr[2];

        day = new Date();
        var nowYear = day.getFullYear();
        var nowMonth = day.getMonth() + 1;
        var nowDay = day.getDate();

        if (nowYear == birthYear) {
            returnAge = 0;
        } else {
            var ageDiff = nowYear - birthYear;
            if (ageDiff > 0) {
                if (nowMonth == birthMonth) {
                    var dayDiff = nowDay - birthDay;
                    if (dayDiff < 0) {
                        returnAge = ageDiff - 1;
                    } else {
                        returnAge = ageDiff;
                    }
                } else {
                    var monthDiff = nowMonth - birthMonth;
                    if (monthDiff < 0) {
                        returnAge = ageDiff - 1;
                    } else {
                        returnAge = ageDiff;
                    }
                }
            } else {
                returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
            }
        }
        return returnAge; //返回周岁年龄
    }
});
