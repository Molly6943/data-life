define(function(require, exports, module) {

    var directory = 'privacy';

    new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/setting-main-V'),
        data: {
        },
        methods: {
        	onSettingCommonTap:function(){
                _g.openWin({
                    header: {
                        data: {
                            title: '通用'
                        }
                    },
                    name: 'privacy-settingCommon',
                    url: '../privacy/setting-common.html',
                    bounces: true,
                    slidBackEnabled: false
                });
        	},
        	onSettingFeedbackTap:function(){
                _g.openWin({
                    header: {
                        data: {
                            title: '应用反馈'
                        }
                    },
                    name: 'privacy-settingFeedback',
                    url: '../privacy/setting-feedback.html',
                    bounces: true,
                    slidBackEnabled: false
                });
        	},
            onSignoutTap: function() {
                _g.rmLS('UserInfo');
                api && api.openWin({
                    name: 'account-index-win',
                    url: '../account/index.html',
                    pageParam: {
                        from: 'root'
                    },
                    bounces: false,
                    slidBackEnabled: false,
                    animation: {
                        type: 'none'
                    }
                });
                setTimeout(function() {
                    _g.closeWins(['main-index-win','privacy-setting-win'])
                }, 50);
            }
        },
    });
});
