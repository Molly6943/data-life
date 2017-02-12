define(function(require, exports, module) {

    var directory = 'activity';

    var publishAcitvity = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/index-main-V'),
        data: {},
        methods: {
            openTrajectory: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '我的轨迹',
                            rightText: '发布'
                        },
                        // template: 'activity/information-main-V'
                    },
                    name: 'activity-information',
                    url: '../activity/information.html',
                    bounces: false,
                    slidBackEnabled: false
                });
                api.closeFrame();
            },
            openActivity: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '发布活动',
                            rightText: '发布'
                        },
                        // template: 'activity/publish-main-V'
                    },
                    name: 'activity-publish',
                    url: '../activity/publish.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam:{
                        type1:1,
                    }
                });
                api.closeFrame();
            },
            openForeseeActivity: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '发布活动',
                            rightText: '发布'
                        },
                        // template: 'activity/publish-main-V'
                    },
                    name: 'activity-publish',
                    url: '../activity/publish.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam:{
                        type1:1,
                    }
                });
                api.closeFrame();
            },
            closeFrame: function() {
                api.closeFrame();
            }
        },
    });
    // api.bringFrameToFront({
    //     from: 'activity-index-frame',
    // });
});
