;(function(){
// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "h+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") // ==> 2016-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      // ==> 2016-7-2 8:9:4.18

    window._g = {
        isAndroid: (/android/gi).test(navigator.appVersion),
        isIOS: (/mac/gi).test(navigator.appVersion),
        uzStorage: function() {
            var ls = window.localStorage;
            if (this.isAndroid) ls = os.localStorage();
            return ls;
        },
        setLS: function(key, value) {
            if (arguments.length === 2) {
                var v = value;
                if (typeof v == 'object') {
                    v = JSON.stringify(v);
                    v = 'obj-' + v;
                } else {
                    v = 'str-' + v;
                }
                var ls = this.uzStorage();
                if (ls) {
                    ls.setItem(key, v);
                }
            }
        },
        getLS: function(key) {
            var ls = this.uzStorage();
            if (ls) {
                var v = ls.getItem(key);
                if (!v) {
                    return; }
                if (v.indexOf('obj-') === 0) {
                    v = v.slice(4);
                    return JSON.parse(v);
                } else if (v.indexOf('str-') === 0) {
                    return v.slice(4);
                }
            }
        },
        rmLS: function(key) {
            var ls = this.uzStorage();
            if (ls && key) ls.removeItem(key);
        },
        clearLS: function() {
            var ls = this.uzStorage();
            if (ls) ls.clear();
        },
        fixStatusBar: function() {
            var header = $('#header')[0];
            if (!api) return;
            if (!header) return;
            if (api.systemType == 'ios') {
                var strSV = api.systemVersion;
                var numSV = parseInt(strSV, 10);
                var fullScreen = api.fullScreen;
                var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;
                if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
                    header.style.paddingTop = '20px';
                }
            } else if (api.systemType == 'android') {
                var ver = api.systemVersion;
                ver = parseFloat(ver);
                if (ver >= 4.4) {
                    header.style.paddingTop = '25px';
                }
            }
        },
        isElement: function(obj) {
            return !!(obj && obj.nodeType == 1);
        },
        isArray: function(obj) {
            if (Array.isArray) {
                return Array.isArray(obj);
            } else {
                return obj instanceof Array;
            }
        },
        isEmptyObject: function(obj) {
            if (JSON.stringify(obj) === '{}') {
                return true;
            }
            return false;
        },
        toast: function(msg, duration, location) {
            if (typeof duration == 'string') location = duration;
            api && api.toast({
                msg: msg || '',
                duration: duration || 2000,
                location: location || 'middle'
            });
        },
        addHeader: function(opts) {
            var header = new Vue({
                el: opts.el || '#header',
                template: _g.getTemplate(opts.template || 'common/header-base-V'),
                data: opts.data || {},
                methods: (function() {
                    return $.extend(true, {
                        onTapLeftBtn: function() {
                            api && api.closeWin();
                        }
                    }, opts.methods);
                })(),
                ready: function() {
                    setTimeout(function() {
                        $('body')[0].style.paddingTop = $('#header').height() + 'px';
                    }, 0);
                }
            });
            return header;
        },
        addContent: function(opts) {
            if (!opts.name) return;
            if (!opts.url) return;
            setTimeout(function() {
                var headerHeight = $('#header').height();
                if (opts.name == 'search-result') headerHeight += 44;
                api && api.openFrame({
                    name: opts.name + '-frame',
                    url: opts.url,
                    bounces: opts.bounces !== false,
                    rect: {
                        x: 0,
                        y: headerHeight,
                        w: 'auto',
                        h: window.innerHeight - headerHeight
                    },
                    pageParam: opts.pageParam || {}
                });
            }, 0);
        },
        openWin: function(opts) {
            if (!opts.name) return;
            if (!opts.url) return;
            api.openWin({
                name: opts.name + '-win',
                url: '../baseWin/index.html',
                bounces: false,
                slidBackEnabled: opts.slidBackEnabled || false,
                pageParam: { opts: opts }
            });
        },
        transData: function(data) {
            for (var d in data) {
                if (typeof data[d] == 'object') data[d] = JSON.stringify(data[d]);
            }
            return data;
        },
        j2s: function(obj) {
            return JSON.stringify(obj);
        },
        s2j: function(s) {
            return JSON.parse(s);
        },
        getTemplate: function(url) {
            var template = '';
            $.ajax({
                url: '../../script/template/' + url + '.html',
                async: false,
                success: function(result) {
                    template = result;
                },
                error: function(msg) {
                    console.log('找不到:' + url + '模板,请检查');
                }
            });
            return template
        }
    }
})();