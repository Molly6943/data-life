/*
----------------------------------------------------
 */
window.APPMODE = 'pub'; // dev:开发模式, pub:发布模式
window.VERSION = '0.0.1'; // 代码版本号, 每次发布之前, 请更新, 小版本号自增+1
window.MOCKJS = false; // 是否打开mockjs, 正式版发布, 或者测试接口数据需要关闭
window.CONFIG = {}; // 全局配置
CONFIG.DEFAULT_AVATAR = '../../image/placeholder.png'; // 默认头像
CONFIG.DEFAULT_PHOTO = '../../image/placeholder.png'; // 默认图片
APPMODE == 'dev' && (function() {
    // CONFIG.HOST = 'http://120.76.72.127:60013';
    CONFIG.HOST = 'http://120.77.17.6:8008';
    // CONFIG.HOST = 'http://192.168.199.102:8008';
    // CONFIG.HOST = 'http://192.168.1.101:8008';
    var isApp = !!window.localStorage.getItem('isApp');
    if (window.APPMODE == 'dev' && !isApp) {
        // 如果是开发模式并且不是app启动
        CONFIG.HOST = '';
    }
})();
APPMODE == 'pub' && (function() {
    // CONFIG.HOST = 'http://120.76.72.127:60013';
    CONFIG.HOST = 'http://120.77.17.6:8008';
})();

// Vue 全局过滤器
Vue.filter('trans-price', function(price) {
    return (price / 100).toFixed(2);
});
Vue.filter('trans-price-before', function(price) {
    return (price / 100).toFixed(2).split('.')[0];
});
Vue.filter('trans-price-after', function(price) {
    return (price / 100).toFixed(2).split('.')[1];
});
Vue.filter('trans-discount', function(discount) {
    return (discount / 10).toFixed(1);
});
Vue.filter('trans-photo', function(photo) {
    return photo ? (CONFIG.HOST + photo) : CONFIG.DEFAULT_PHOTO;
});
Vue.filter('trans-avatar', function(avatar) {
    return avatar ? (avatar) : CONFIG.DEFAULT_AVATAR;
});
Vue.filter('trans-sex', function(sex) {
    switch (Number(sex)) {
        case -1:
            return '';
            break;
        case 0:
            return '女';
            break;
        case 1:
            return '男';
            break;
        case 2:
            return '备孕';
            break;
    }
});
Vue.filter('trans-date', function(millisec) {
    if ((millisec + '').length < 13) millisec *= 1000;
    var now = new Date().getTime();
    var delta = Math.round((now - millisec) / 1000);
    var showNum = 0;
    var showText = '';
    if (delta < 60 * 60) {
        // 一个小时内,显示 *分钟前
        showNum = Math.floor(delta / 60);
        showNum = showNum == 0 ? 1 : showNum;
        showText = showNum + '分钟前';
    } else if (delta >= 60 * 60 && delta < 24 * 60 * 60) {
        // 一天内,超过一个小时,显示 *小时前
        showNum = Math.floor(delta / 3600);
        showText = showNum + '小时前';
    } else if (delta >= 24 * 60 * 60 && delta < 72 * 60 * 60) {
        // 三天内,超过一天,显示 *天前
        showNum = Math.floor(delta / 3600 / 24);
        showText = showNum + '天前';
    } else {
        var d = new Date();
        d.setTime(millisec);
        showText = d.Format('yyyy-MM-dd');
    }
    return showText;
});
Vue.filter('trans-month-day', function(millisec) {
    if ((millisec + '').length < 13) millisec *= 1000;
    var showText = '';
    var d = new Date();
    d.setTime(millisec);
    showText = d.Format('MM-dd');
    return showText;
});

apiready = function() {
    var isApp = !!window.localStorage.getItem('isApp');
    if (typeof api == 'undefined' && !isApp) api = window.Xui;
    window.isReady = true;
    seajs.use([
        $('#entry').data('path'),
    ], function(Common, Vue, VueTouch, Entry, Mock) {
        _g.fixStatusBar();
        console.log('entry')
    });
};

// 兼容模拟器启动
$(function() {
    if (window.APPMODE == 'dev' && window.location.search.indexOf('isApp=1') > -1) {
        // 如果是开发模式并且是app启动
        window.localStorage.setItem('isApp', 1);
    }
    var isApp = !!window.localStorage.getItem('isApp');
    if ($('#entry').data('path') == 'app') isApp = true;
    window.APPMODE == 'dev' && !isApp && !window.isReady && apiready();
    window.APPMODE == 'pub' && window.location.host && !window.isReady && apiready();
    setTimeout(function() {
        !window.isReady && apiready();
    }, 2000);
});
