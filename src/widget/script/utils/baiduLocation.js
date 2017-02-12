define(function(require, exports, module) {

    var baiduLocation = api && api.require('baiduLocation');

    function BaiduLocation() {
        this.status = !!baiduLocation;
    }

    BaiduLocation.prototype = {
        start: function(opts) {
            if (!this.check()) return;
            baiduLocation.startLocation({
                accuracy: opts.accuracy || '100m',
                filter: opts.filter || 1,
                autoStop: opts.autoStop || true
            }, function(ret, err) {
                if (ret.status) {
                    opts.success && opts.success(ret);
                } else {
                    opts.error && opts.error(err);
                }
            });
        },
        stop: function() {
            if (!this.check()) return;
            baiduLocation.stopLocation();
        },
        get: function(opts) {
            if (!this.check()) return;
            baiduLocation.getLocation(function(ret, err) {
                if (ret) {
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

    BaiduLocation.prototype.constructor = BaiduLocation;

    module.exports = new BaiduLocation();

});
