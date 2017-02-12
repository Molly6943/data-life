define(function(require, exports, module) {

    var directory = 'sharing';
    var header = new Vue({
        el: '#header',
        template: _g.getTemplate('main/sharing-header-V'),
        data: {
            active: 0,
            title: '共享',
            isHome: 1,
            list: [
                '消息',
                '运动',
                '共享',
                '隐私',
            ]
        },
        methods: {
            onTapRightBtn: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '类别'
                        }
                    },
                    name: 'sharing-classification',
                    url: '../sharing/classification.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            }
        }
    });

    var sharing = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/square-main-V'),
        data: {
            list: [{
                bgImage: '../../image/sharing/postAdvertisement.png',
                title: '我发广告',
                content: '预付定金，凭质打赏',
                price: '（1元／次起）',
                btnText: '点击参与',
                bgColor: '#FFC001',
                isPost: 1
            }, {
                bgImage: '../../image/sharing/seePoster.png',
                title: '我看广告',
                content: '领取定金，评论有赏',
                price: '（1元／次起）',
                btnText: '点击参与',
                bgColor: '#98C13E',
                isPost: 0
            }, {
                bgImage: '../../image/sharing/sendMessage.png',
                title: '我发信息',
                content: '领取定金，凭质领赏',
                price: '（1元／次起）',
                btnText: '点击参与',
                bgColor: '#77D9A5',
                isPost: 1
            }, {
                bgImage: '../../image/sharing/seeMessage.png',
                title: '我看信息',
                content: '领取定金，凭质领赏',
                price: '（1元／次起）',
                btnText: '点击参与',
                bgColor: '#47AEDC',
                isPost: 0
            }, {
                bgImage: '../../image/sharing/sellProduct.png',
                title: '我卖产品',
                content: '预付定金，再付赏金',
                price: '（定金2成起）',
                btnText: '点击参与',
                bgColor: '#F47574',
                isPost: 1
            }, {
                bgImage: '../../image/sharing/buyProduct.png',
                title: '我买产品',
                content: '领取定金，再领赏金',
                price: '（定金2成起）',
                btnText: '点击参与',
                bgColor: '#8E8CE6',
                isPost: 0
            }, {
                bgImage: '../../image/sharing/postMission.png',
                title: '我发任务',
                content: '预付定金，评论有赏',
                price: '（定金2成起）',
                btnText: '点击参与',
                bgColor: '#C0FDD0',
                isPost: 1
            }, {
                bgImage: '../../image/sharing/getMission.png',
                title: '我领任务',
                content: '领取定金，凭质打赏',
                price: '（定金2成起）',
                btnText: '点击参与',
                bgColor: '#946A89',
                isPost: 0
            }, {
                bgImage: '../../image/sharing/postBusiness.png',
                title: '我发业务',
                content: '预付定金，凭质打赏',
                price: '（定金2成起）',
                btnText: '点击参与',
                bgColor: '#8C2277',
                isPost: 1
            }, {
                bgImage: '../../image/sharing/getBusiness.png',
                title: '我接业务',
                content: '领取定金，凭质打赏',
                price: '（定金2成起）',
                btnText: '点击参与',
                bgColor: '#392F8E',
                isPost: 0
            }, ]
        },
        ready:function(){
            setTimeout(function(){
                $('body').css('padding-top',$('#header').height()+'px');
            },0)
        },
        methods: {
            onClassTap: function(index) {
                _g.openWin({
                    header: {
                        data: {
                            title: '类别'
                        }
                    },
                    name: 'sharing-classification',
                    url: '../sharing/classification.html',
                    bounces: true,
                    slidBackEnabled: false,
                    pageParam: {
                        isPost: sharing.list[index].isPost
                    }
                });
            }
        },
    });
});
