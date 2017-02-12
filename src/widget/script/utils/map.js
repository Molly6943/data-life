define(function(require, exports, module) {
    function map() {
        this.lon = 0;
        this.lat = 0;
        this.lastIndex = 0;
    }

    map.prototype = {
        // init: function(opts) {
        //     this._opts = $.extend(true, this._opts, opts);
        //     this.nowTime = this._opts.times;
        //     this.nowText = this._opts.initText;
        //     this._opts.onInit(this.nowText);
        // },
        openMap: function(obj, x, y, w, h, frameName) {
            // obj.close();
            // alert(this.lon + ' , ' + this.lat);
            obj.open({
                rect: {
                    x: x,
                    y: y,
                    w: w,
                    h: h
                },
                showUserLocation: true,
                zoomLevel: 11,
                fixedOn: frameName,
                fixed: true
            }, function(ret, err) {
                if (ret.status) {
                    // alert(JSON.stringify(ret));
                } else {
                    // alert(JSON.stringify(err));
                }
            });
        },
        openBMap: function(obj, x, y, w, h, frameName) {
            obj.open({
                rect: {
                    x: x,
                    y: y,
                    w: w,
                    h: h
                },
                zoomLevel: 11,
                showUserLocation: true,
                fixedOn: api.frameName,
                fixed: true
            }, function(ret) {
                if (ret.status) {
                    alert('地图打开成功');
                }
            });
        },
        getUserLocation: function(obj) {
            var self = this;
            obj.getLocation(function(ret, err) {
                if (ret.status) {
                    self.lon = ret.lon;
                    self.lat = ret.lat;
                    obj.setCenter({
                        coords: {
                            lon: self.lon,
                            lat: self.lat
                        },
                        animation: false
                    });
                } else {
                    _g.toast('获取定位失败！');
                }
            });
        },
        setTrajectoryPoint: function(obj, list, iconList) {
            var self = this;
            obj.addAnnotations({
                annotations: list,
                // icons: iconList,
                draggable: true,
                timeInterval: 3163600
            }, function(ret) {
                if (ret.eventType == 'click') {
                    obj.popupBubble({
                        id: ret.id
                    });
                    // if(self.lastIndex != ret.id){
                    //     obj.closeBubble({
                    //         id: self.lastIndex
                    //     });
                    //     self.lastIndex = ret.id;
                    // }
                    // _.each(list, function(item, index) {
                    //     obj.closeBubble({
                    //         id: item.id
                    //     });
                    // });
                }
            });
            // obj.addMobileAnnotations({
            //     annotations: list
            // }, function(ret, err) {
            //     obj.popupBubble({
            //         id: ret.id
            //     });
            // })
        },
        setBubble: function(obj, list, bgType) {
            var bgUrl = '';
            var contentText = '';
            if (bgType == 'sport') {
                bgUrl = 'widget://image/activity/bgImg.png';
            } else {
                bgUrl = 'widget://image/activity/bgImg.png';
            }
            _.each(list, function(n, i) {
                if (api.systemType == 'android') {
                    if (n.content.title.length > 10) {
                        n.content.title = n.content.title.substring(0, 10);
                        n.content.title += '...';
                        // alert(n.content.subTitle);
                    }
                }
                obj.setBubble({
                    id: n.id,
                    bgImg: bgUrl,
                    content: n.content,
                    styles: {
                        titleColor: '#000',
                        titleSize: 48,
                        subTitleColor: '#fff',
                        subTitleSize: 16,
                        illusAlign: 'left'
                    }
                }, function(ret) {
                    if (ret) {
                        if (ret.eventType == 'clickContent') {
                            var height = api.winHeight - (api.winWidth * 454 / 320);
                            api.sendEvent({
                                name: 'map-open-frame',
                                extra: {
                                    actionID: ret.id
                                }
                            });
                        }
                    }
                });
            });
        },
        setLine: function(obj, list) {
            obj.addLine({
                id: Number(list.length) + 1,
                styles: {
                    type: 'arrow',
                    borderColor: '#CFCFCF',
                    borderWidth: 3,
                    lineDash: true,
                    strokeImg: ''
                },
                points: list
            });
        }
    };

    map.prototype.constructor = map;

    module.exports = new map();

});
