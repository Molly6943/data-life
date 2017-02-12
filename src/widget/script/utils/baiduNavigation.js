define(function(require, exports, module) {

    var baiduNavigation = api && api.require('baiduNavigation');

    function BaiduNavigation() {
        this.status = !!baiduNavigation;
    }

    BaiduNavigation.prototype = {
        start: function(opts) {
            if (!this.check()) return;
            if (!opts.start) return;
            if (!opts.end) return;
            baiduNavigation.start({
                start: opts.start || { // 起点信息.
                    position: { // 经纬度，与address配合可为空
                        lon: 112.47723797622677, // 经度.
                        lat: 34.556480000000015 // 纬度.
                    },
                    title: "中国四大石窟之一", // 描述信息
                    address: "龙门石窟" // 地址信息，与position配合为空
                },
                goBy: opts.goBy,
                end: opts.end || { // 终点信息.
                    position: { // 经纬度，与address配合可为空
                        lon: 111.57062599999995, // 经度
                        lat: 33.784214 // 纬度
                    },
                    title: "龙蛇之窟", // 描述信息
                    address: "鸡冠洞" // 地址信息，与position配合为空
                }
            }, function(ret, err) {
                if (ret.status) {
                    opts.success && opts.success(ret);
                } else {
                    opts.error && opts.error(err);
                }
            });
        },
        check: function() {
            if (!this.status) {
                _g.toast('定位模块加载失败');
            }
            return this.status;
        }
    };

    BaiduNavigation.prototype.constructor = BaiduNavigation;

    module.exports = new BaiduNavigation();

});
