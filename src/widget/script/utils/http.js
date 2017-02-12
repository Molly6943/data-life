define(function(require, exports, module) {

    // Usage
    // -----------------------------
    // var Http = require('U/http');
    // Http.ajax({
    //     data: { user_phone: 13800138005, password: 123123},
    //     url: '/app/user/login.do',
    //     success: function(ret){},
    //     error: function(err){},
    // });

    var MD5 = require('U/md5'); // MD5('string')
    var Ksort = require('U/ksort'); // Ksort(object)
    var UserInfo = _g.getLS('UserInfo');

    function Http() {
        this._opts = {
            // 接口版本号
            api_versions: 'v1',
            // app版本号
            app_versions: api ? api.appVersion : '0.0.0',
            // 设备唯一标识
            device_code: api ? api.deviceId : 'developer',
            // 平台标识
            platform: api ? (function() {
                if (api.systemType == 'android') return 1;
                else if (api.systemType == 'ios') return 2;
                else if (api.systemType == 'web') return 0;
            })() : 0,
            // 接口请求参数 Json格式，如果无值，可留空或直接传递{}
            data: null,
            // 当前登录SESSIONKEY，登录时由接口返回，如果没有，则留空
            session_key: (UserInfo && UserInfo.session_key) ? UserInfo.session_key : '',
            // 用户id，当前登录的用户id，登录时由接口返回，如果没有，则留空
            user_id: (UserInfo && UserInfo.user_id) ? UserInfo.user_id : 0,
            // 10位时间戳
            timestamp: 0,
            // MD5加密串
            // token: '',
        };
        this._opts = {
            // 接口版本号
            api_versions: 'v1',
            // app版本号
            app_versions: api ? api.appVersion : '0.0.0',
            // 设备唯一标识
            device_code: api ? api.deviceId : 'developer',
            // sessionID
            sessionID: (UserInfo && UserInfo.sessionID) ? UserInfo.sessionID :'',
        };
        this.isLock = false;
    }

    Http.prototype = {
        jsonToPostDataStr: function(json){
            var PostDataStr='';
            for(var i in json){
                PostDataStr+=i+'='+ json[i] +'&';
            }
            return PostDataStr=='' ?  PostDataStr : PostDataStr.slice(0,-1);
        },
        fetchToken: function(postData) {
            return MD5(this.jsonToPostDataStr(Ksort(postData)));
        },
        fetchPostData: function(data) {
            // return data;
            // return $.extend(true, data, this._opts);
            this.update();
            var postData = $.extend(true, {}, this._opts);
            postData.data = $.extend(true, {}, data);
            postData.timestamp = Math.round(new Date().getTime()/1000);
            postData.token = this.fetchToken(postData);
            return postData;
        },
        ajax: function(opts) {
            var startTime = new Date().getTime();
            _g.setLS('LastTime', startTime);
            var self = this;
            if(self.isLock) return;
            if(!opts.data || !opts.url) return;
            var postData = self.fetchPostData(opts.data);
            if(opts.lock !== false) self.lock();
            if(opts.isSync) _g.showProgress();
            api && api.ajax({
                url: CONFIG.HOST + opts.url,
                method: opts.method || 'post',
                timeout: 60*20,
                dataType: 'json',
                returnAll: false,
                data: (function(){
                    // if(opts.files) {
                    //     return {
                    //         values: postData,
                    //         files: opts.files
                    //     }
                    // }
                    return { values: postData }
                })()
                // data: { values: postData }
            }, function(ret, err){
                self.unlock();
                _g.refreshDone();
                if(opts.isSync) _g.hideProgress();
                if(ret){
                    if(ret.code == 50002){
                        _g.rmLS('UserInfo');
                        _g.rmLS('sessionID');
                        api.alert({
                            title: '提示',
                            msg: '账号登录已过期',
                        }, function(ret, err) {
                            _g.checkUser();
                        });
                    }
                    if(ret.code != 200 && ret.code != 50002) _g.toast(ret.msg);
                    opts.success && opts.success(ret);
                }else {

                    // _g.toast('错误接口：'+opts.url+'，错误码：'+err.code+'，错误信息：'+err.msg+'，网络状态码：'+err.statusCode);
                    _g.toast('网络连接失败, 请检查网络!');
                    opts.error && opts.error(err);
                };
            });
        },
        lock: function() {
            this.isLock = true;
        },
        unlock: function(){
            this.isLock = false;
        },
        update: function() {
            var UserInfo = _g.getLS('UserInfo');
            var sessionID = _g.getLS('sessionID');
            this._opts.sessionID = sessionID || '';
        },
    };

    Http.prototype.constructor = Http;

    module.exports = new Http();

});
