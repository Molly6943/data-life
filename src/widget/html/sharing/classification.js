define(function(require, exports, module) {
    var Http = require('U/http');
    var directory = 'sharing';
    var isPost = api.pageParam.isPost;
    var classification = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/classification-main-V'),
        data: {
            list: [{
                image: '',
                text: '',
            }]
        },
        methods: {
            onTurnPageTap: function(index) {
                if (isPost == 1) {
                    _g.openWin({
                        header: {
                            data: {
                                title: '发布活动',
                                rightText: '发布'
                            }
                        },
                        name: 'activity-publish',
                        url: '../activity/publish.html?mod=dev',
                        bounces: true,
                        slidBackEnabled: false,
                        pageParam:{
                            type1:1,
                        }
                    });
                } else{
                    setTimeout(function() {
                        api.sendEvent({
                            name: 'main-index-message'
                        })
                    }, 0)
                    setTimeout(function() {
                        _g.closeWins(['sharing-classification-win', 'activity-publish-win'])
                    }, 1000);
                }
            }
        },
    });

    function getData() {
        Http.ajax({
            data: {
                type: 2,
            },
            isSync: true,
            url: '/system/info',
            success: function(ret) {
                if (ret.code == 200) {
                    classification.list = machData(ret.data);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function machData(data) {
        return _.map(data, function(item) {
            return {
                image: item.img,
                text: item.name,
            }
        });
    }
    getData();
});
