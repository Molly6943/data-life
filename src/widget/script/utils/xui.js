;(function(){
    function Xui() {
        this.params = {
            ajax: {
                url: '',
                method: 'post',
                timeout: 60 * 20,
                dataType: 'json',
                data: {}
            }
        };
    }

    Xui.prototype = {
        ajax: function(params, callback) {
            var ret,
                err;
            params = _.extend({}, this.params, params);
            if (!callback || typeof callback !== 'function') {
                console.log('callback不存在或者callback不是一个函数');
                return;
            }
            if (!params.url) {
                console.log('url为空');
                return;
            }
            $.ajax({
                type: params.method,
                url: params.url,
                data: params.data,
                cache: false,
                dataType: params.dataType,
                success: function(result) {
                    ret = result;
                    callback(ret, err);
                },
                error: function(result) {
                    err = result;
                    callback(ret, err);
                }
            });
        },
        setRefreshHeaderInfo: function() {}
    };

    Xui.prototype.constructor = Xui;

    window.Xui = new Xui();
})();

// define(function(require, exports, module) {

    

// });
