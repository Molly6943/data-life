define(function(require, exports, module) {
    window.emotionData;
    getImgsPaths(function(emotion) {
        emotionData = emotion;
    });
    var Http = require('U/http');
    var aMap = api.require('aMap');
    var map = require('U/map');
    var UserInfo = _g.getLS('UserInfo');
    var directory = 'message';
    var page = 1;
    var UserInfo = _g.getLS('UserInfo');

    var mainMessage = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/market-main-V'),
        components: {
            cell: {
                props: ['item'],
                template: _g.getTemplate(directory + '/market-cell-V'),
            },
        },
        data: {
            active: 3,
            isOpenFrame: false,
            isCommentFrame: false,
            change: 0,
            list: [{
                showImage:true,
                showNow:false,
                showReady:false,
                showDone:false,
                userID: '',
                actionID: '',
                nickname: '',
                avatar: '',
                type: '',
                star: 5,
                content: '',
                hobby: '',
                cmtNum: 0,
                zanNum: 0,
                caiNum: 0,
                timeText: '',
                isAttention: 0,
                image:'',
                stars: [{
                    pic: '../../image/message/start2.png'
                }, {
                    pic: '../../image/message/start2.png'
                }, {
                    pic: '../../image/message/start2.png'
                }, {
                    pic: '../../image/message/start2.png'
                }, {
                    pic: '../../image/message/start2.png'
                }],
                likeList: [{
                    likename: '',
                }],
                comList: [{
                    name: '',
                    text: '',
                }],
            }],
            lon: 0,
            lat: 0,
        },
        created: function() {
            this.list = [];
        },
        ready: function() {
            $(this.$el).find('[data-img]').each(function() {
                var self = $(this);
                var img = new Image;
                img.onload = function () {
                    self.append(img);
                }
                img.src = self.data('img');
            });
        },
        methods: {
            onMessageDetailTap: function(event, index) {
                if ($(event.target).hasClass('is-attention')) {
                    Http.ajax({
                        data: {
                            userID: UserInfo.userID,
                            favUserID: mainMessage.list[index].userID,
                        },
                        isSync: true,
                        url: '/user/setAttention',
                        success: function(ret) {
                            if (ret.code == 200) {
                                _.each(mainMessage.list, function(item, itemIndex) {
                                    if (mainMessage.list[index].userID == item.userID) {
                                        mainMessage.list[itemIndex].isAttention = (function() {
                                            if (item.isAttention == 1) return 2;
                                            if (item.isAttention == 2) return 1;
                                        })();
                                    }
                                });
                                _g.toast(ret.msg);
                            } else {
                                _g.toast(ret.msg);
                            }
                        },
                        error: function(err) {}
                    });
                } else if ($(event.target).hasClass('ui-index__avatar')) {
                    if(UserInfo.userID == mainMessage.list[index].userID) {
                        _g.openWin({
                            header: {
                                data: {
                                    title: '我的首页'
                                }
                            },
                            name: 'privacy-index',
                            url: '../privacy/index.html',
                            bounces: false,
                            slidBackEnabled: false,
                            pageParam: {
                                userID: mainMessage.list[index].userID,
                            }
                        });
                    }else {
                        _g.openWin({
                            header: {
                                data: {
                                    title: mainMessage.list[index].nickname,
                                }
                            },
                            name: 'privacy-othersPage',
                            url: '../privacy/othersPage.html',
                            bounces: false,
                            slidBackEnabled: false,
                            pageParam: {
                                userID: mainMessage.list[index].userID,
                            }
                        });
                    }
                }else if ($(event.target).hasClass('ui-index__image')) {
                    _g.openWin({
                        header: {
                            data: {
                                title: mainMessage.list[index].nickname,
                            },
                            // template: 'main/barMenu-header-V'
                        },
                        pageParam: {
                            actionID: mainMessage.list[index].actionID,
                            // marketType:1,
                        },
                        name: 'message-detail',
                        url: '../message/detail.html',
                        bounces: true,
                        slidBackEnabled: false,
                    });
                } else {
                    _g.openWin({
                        header: {
                            data: {
                                title: mainMessage.list[index].nickname,
                            },
                            // template: 'main/barMenu-header-V'
                        },
                        pageParam: {
                            actionID: mainMessage.list[index].actionID,
                            // marketType:1,
                        },
                        name: 'privacy-taskDetail',
                        url: '../privacy/taskDetail.html',
                        bounces: true,
                        slidBackEnabled: false,
                    });
                }
            },
            onPicTap: function() {

            }
        },
    });

    function replyToImage(reply) {
        var reg = /\[(.*?)\]/gm;
        var newReply = reply.replace(reg, function(match) {
            var imgSrc = emotionData[match];
            if (!imgSrc) return match;
            var img = '<img src="' + imgSrc + '">';
            return img;
        });
        return newReply;
    }
    // 表情地址
    function getImgsPaths(callback) {
        var jsonPath = 'widget://res/emotion/emotion.json';
        api.readFile({
            path: jsonPath
        }, function(ret, err) {
            if (ret.status) {
                var emotionAry = JSON.parse(ret.data);
                var emotion = {};
                for (var i = 0; i < emotionAry.length; i++) {
                    emotion[emotionAry[i].text] = '../../res/emotion/' + emotionAry[i].name + '.png';
                }
                if (typeof(callback) === 'function') callback(emotion);
            }
        });
    }

    function getData() {
        Http.ajax({
            data: {
                page: page,
                type: 3
            },
            isSync: true,
            lock: false,
            url: '/action/getNews',
            success: function(ret) {
                if (ret.code == 200) {
                    setTimeout(function() {
                        if (ret.data.length == 0) {
                            _g.toast('没有更多了~');
                            window.isNoMore = true;
                        }
                        if (page == 1) {
                            mainMessage.list = machData(ret.data);
                            
                        } else {
                            mainMessage.list = mainMessage.list.concat(machData(ret.data));
                        }

                    }, 0);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }


    function changeValue(value) {
        switch (Number(value)) {
            case 1:
                return "餐饮";
                break;
            case 2:
                return "运动";
                break;
            case 3:
                return "衣着";
                break;
            case 4:
                return "娱乐";
                break;
            case 5:
                return "交通";
                break;
            case 6:
                return "住宿";
                break;
            case 7:
                return "工作";
                break;
            case 8:
                return "学习";
                break;
            case 9:
                return "购物";
                break;
            case 10:
                return "家务";
                break;
            case 11:
                return "社交";
                break;
            case 12:
                return "啪啪";
                break;
            case 13:
                return "亲子";
                break;
            case 14:
                return "睡觉";
                break;
            case 15:
                return "其他";
                break;
        }
    }

    function machData(data) {
        return _.map(data, function(item, index) {
            var starPic = []; //星星
            if (Number(item.avgEvaNum) == 0) {
                for (var i = 0; i < 5; i++) {
                    starPic.push({
                        'pic': '../../image/message/start2.png'
                    })
                }
            } else {
                for (var i = 0; i < 5; i++) {
                    if (i < item.avgEvaNum) {
                        starPic.push({
                            'pic': '../../image/message/index-star.png'
                        })
                    } else {
                        starPic.push({
                            'pic': '../../image/message/start2.png'
                        })
                    }
                }
            }

            //判断当前的活动是准备进行，还是正在进行，还是已经结束
            // var end = new Date(data[index].endTime.replace(/-/g, '/')).getTime();
            // var start = new Date(data[index].startTime.replace(/-/g, '/')).getTime();
            var end = data[index].endTime;
            var start = data[index].startTime;
            var now = new Date().getTime();
            var showNow;
            var showReady;
            var showDone;
            var showImage;
            if (now > end) {
                showNow = false;
                showReady = false;
                showDone = true;
            } else if (now > start && now < end) {
                showNow = true;
                showReady = false;
                showDone = false;
            }else{
                showNow = false;
                showReady = true;
                showDone = false;
            }
            //判断是否有图片
            if(item.images.length == 0) {
                showImage = false;
            }else {
                showImage = true;
            }
            return {
                showImage:showImage,
                showNow:showNow,
                showReady:showReady,
                showDone:showDone,
                userID: item.user.userID,
                actionID: item.actionID,
                nickname: item.user.name,
                avatar: CONFIG.HOST + item.user.avatar,
                type: changeValue(item.actType),
                stars: starPic,
                content: item.content,
                hobby: item.user.hobbies || '什么都没有~',
                cmtNum: item.cmtNum,
                zanNum: item.zanNum,
                caiNum: item.caiNum,
                image: CONFIG.HOST+item.images[0] || '',
                timeText: item.lastTime,
                isAttention: item.isAttention,
                likeList: _.map(data[index].zanArr, function(item) {
                    return {
                        likename: item.name,
                    }
                }),
                comList: _.map(data[index].cmtArr, function(item) {
                    return {
                        name: item.name,
                        text: replyToImage(item.content),
                    }
                }),
            }
        });
    }

    getData();

    _g.setPullDownRefresh(function() {
        page = 1;
        getData();
    });
    _g.setLoadmore(function() {
        page++;
        getData();
    });

    //监听样式切换
    api.addEventListener({
        name: 'message-changeShowList'
    }, function(ret, err) {
        var classList = document.querySelector('.ui-index').classList;
        if (mainMessage.change == 0) {
            mainMessage.change = 1;
            classList.remove('is-list');
            classList.add('is-grid');
        } else {
            mainMessage.change = 0;
            classList.remove('is-grid');
            classList.add('is-list');
        }
    });

    api.addEventListener({
        name: 'message-index-refreshFrame'
    }, function(ret, err) {
        getData();
    })
});
