define(function(require, exports, module) {
    var aMap = api.require('aMap');
    var map = require('U/map');
    var directory = 'activity';
    var page = 1;
    var nearby = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/nearby-main-V'),
        data: {
            location: false,
            keyWords: '',
            list: [{
                uid: '',
                name: '',
                type: '',
                lat: 0,
                lon: 0,
                address: '',
                tel: '',
                distance: 0
            }],
            address:{
                country: '中国',
                province: '',
                city: '',
                area: '',
                addr: '',
            },
            lon: '',
            lat: ''
        },
        created: function() {
            this.list = [];
        },
        methods: {
            onSearchTap: function() {
                var action = $(event.target).attr('data-action');
                if (action == 'search') {
                    searchArea();
                }
            },
            onEnter: function() {
                if(nearby.keyWords == '') {
                    _g.toast('你还没有输入任何内容哦~');
                }else {
                    searchArea();
                }
            },
            chooseLocation: function(index) {
                api.sendEvent({
                    name: 'nearby-nearbyName',
                    extra: {
                        name: nearby.list[index].name,
                        lon: nearby.list[index].lon,
                        lat: nearby.list[index].lat,
                    }
                });
                api.closeWin();
            }
        },
    });

    function getLocation() {
        map.openMap(aMap, api.winWidth, 0, 1, 1);
        aMap.getLocation(function(ret, err) {
            if (ret.status) {
                nearby.lon = ret.lon;
                nearby.lat = ret.lat;
                getCityName();
            } else {
                _g.toast('获取定位失败！');
            }
        });
    }


    function getCityName() {
        aMap.getNameFromCoords({
            lon: nearby.lon,
            lat: nearby.lat
        }, function(ret, err) {
            if (ret.status) {
                setTimeout(function() {
                    nearby.address.province = ret.state;
                    nearby.address.city = ret.city;
                    nearby.address.area = ret.district;
                    nearby.address.addr = ret.street;
                    searchArea();
                }, 0);
            } else {
                alert(JSON.stringify(err));
            }
        });
    }
    function searchArea() {
        _g.showProgress();
        aMap.searchNearby({
            keyword: nearby.keyWords || nearby.address.addr,
            lon: nearby.lon,
            lat: nearby.lat,
            radius: 2000,
            offset: 50,
            page: page,
            sortrule: 0
        }, function(ret, err) {
            _g.hideProgress();
            if (ret.status) {
                nearby.list = ret.pois;
            } else {
                _g.toast('请输入你所在的位置');
            }
        });
    }
    getLocation();

    // _g.setLoadmore(function() {
    //     page = page + 1;
    //     searchArea();
    // });
});
