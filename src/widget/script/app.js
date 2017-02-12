define(function(require, exports, module) {
    var Http = require('U/http');
    var fs = api.require('fs');
    api && api.setFullScreen({
        fullScreen: false
    });

    api && api.setStatusBarStyle({
        style: 'light'
    });

    if (window.APPMODE == 'dev' && !window.location.host) {
        api.clearCache();
        api.removeLaunchView();

        api.prompt({
            buttons: ['确定', '取消']
        }, function(ret, err) {
            if (ret) {
                var url = 'http://' + ret.text + ':3377';
                api.openWin({
                    name: 'dev-win',
                    url: url + '/index.html?isApp=1',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: { key: 'value' },
                    animation: { type: 'none' }
                });
            }
        });

        return

        api.actionSheet({
            title: '选择开发远端地址',
            cancelTitle: '取消',
            buttons: ['小草-home', '小草-home', '昕亮', '子杰']
        }, function(ret, err) {
            if (ret.buttonIndex == 1) {
                var url = 'http://192.168.199.100:3377';
            } else if (ret.buttonIndex == 2) {
                var url = 'http://172.26.86.200:3377';
            } else if (ret.buttonIndex == 3) {
                var url = 'http://172.26.129.111:3377';
            } else if (ret.buttonIndex == 4) {
                var url = 'http://172.19.141.123:3377';
            }

            url = 'http://192.168.199.100:3377';

            api.openWin({
                name: 'dev-win',
                url: url + '/index.html?isApp=1',
                bounces: false,
                slidBackEnabled: false,
                pageParam: { key: 'value' },
                animation: { type: 'none' }
            });
        });

        return
    }

    // _g.rmLS('isFirstStart');
    // _g.rmLS('UserInfo');

    // 如果是第一次打开app, 启动引导页
    // if (!_g.getLS('isFirstStart')) {
    //     api && api.openWin({
    //         name: 'account-index-win',
    //         url: './html/account/index.html',
    //         bounces: false,
    //         slidBackEnabled: false
    //     });
    //     _g.setLS('isFirstStart',true);
    //     return;
    // }


    var startTime = new Date().getTime();
    var LastTime = _g.getLS('LastTime');
    if (!LastTime) _g.setLS('LastTime', startTime);
    if (startTime - LastTime > 7 * 24 * 60 * 60 * 1000) {
        _g.rmLS('UserInfo');
    }
    _g.setLS('LastTime', startTime);
    // 删除文件夹
    fs.rmdir({
        path: 'fs://temp'
    }, function(ret, err) {

    });
    fs.rmdir({
        path: 'fs://download'
    }, function(ret, err) {

    });
    //头像下载广播
    api && api.addEventListener({
        name: 'do-download-headImg'
    }, function(ret, err) {
        if (ret.value.url == '') {
            api.sendEvent({
                name: 'activity-DownDone-addArr',
                extra: {
                    url: 'widget://image/account/icon-avatar.png',
                    index:ret.value.index
                }
            })
        } else {
            doDownload(ret.value.url, ret.value.path, ret.value.host, ret.value.index)
        }
    });
    //下载方法
    function doDownload(url, savePath, host, index) {
        // alert(url + " : " + savePath + ' : ' + host);
        // return;
        api.download({
            url: host + url,
            // url: 'http://img4.duitang.com/uploads/item/201603/26/20160326193535_dj8cx.jpeg',
            savePath: 'fs://temp' + savePath,
            // savePath: 'fs://temp/upload/pic/avatar/20161117092057652.jpg',
            report: false,
            cache: true,
            allowResume: true
        }, function(ret, err) {
            //下载完成
            if (ret != undefined) {
                if (ret.state == 1) {
                    api.sendEvent({
                        name: 'activity-DownDone-addArr',
                        extra: {
                            url: 'fs://temp' + savePath,
                            index:index
                        }
                    })
                }
            } else {
                api.sendEvent({
                    name: 'activity-DownDone-addArr',
                    extra: {
                        url: 'fs://temp' + savePath,
                        index:index
                    }
                })
            }

        });
    };

    if (_g.getLS('UserInfo')) {
        openMainPage();
    } else {
        openLoginPage();
    }

    function openMainPage() {
        api && api.openWin({
            name: 'main-index-win',
            url: './html/main/index.html',
            bounces: false,
            slidBackEnabled: false,
            animation: { type: 'none' }
        });
    }

    function openLoginPage() {
        api && api.openWin({
            name: 'account-index-win',
            url: './html/account/index.html',
            pageParam: {
                from: 'root'
            },
            bounces: false,
            slidBackEnabled: false,
            animation: { type: 'none' }
        });
    }

    api.addEventListener({
        name: 'shake'
    }, function(ret, err) {
        if (window.APPMODE == 'pub') return;
        api.alert({
            title: '当前代码版本为:',
            msg: window.VERSION,
        }, function(ret, err) {

        });
    });

    module.exports = {};

});
