define(function(require, exports, module) {

    function Vcode() {
        this.timer = null;
        this._opts = {
            initText: '获取验证码',
            timeText: 's后',
            times: 60,
            allow: true,
            onInit: function(nowText) {},
            onAction: function(nowText) {}
        };
    }

    Vcode.prototype = {
        init: function(opts) {
            this._opts = $.extend(true, this._opts, opts);
            this.nowTime = this._opts.times;
            this.nowText = this._opts.initText;
            this._opts.onInit(this.nowText);
        },
        getRandom: function(length) {
            var random = '';
            length = length > 0 ? length : 1;
            for (var i = length - 1; i >= 0; i--) {
                var num = Math.round(Math.random() * 10);
                random += (num == 10 ? 0 : num);
            }
            return random;
        },
        ticker: function() {
            var self = this;
            this.timer = setTimeout(function() {
                self.action();
            }, 1000);
        },
        action: function() {
            this.nowTime--;
            if (this.nowTime == 0) {
                this.nowText = this._opts.initText;
                this.stop();
            } else {
                this.nowText = this.nowTime + this._opts.timeText;
                this.ticker();
            }
            this._opts.onAction(this.nowText);
        },
        start: function() {
            this._opts.allow = false;
            this.ticker();
        },
        stop: function() {
            this._opts.allow = true;
            this.timer = null;
            this.nowTime = this._opts.times;
        },
        isAllow: function() {
        	return this._opts.allow;
        }
    };

    Vcode.prototype.constructor = Vcode;

    module.exports = new Vcode();

});
