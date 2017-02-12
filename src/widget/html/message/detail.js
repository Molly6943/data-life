define(function(require, exports, module) {
    window.emotionData;
    getImgsPaths(function(emotion) {
        emotionData = emotion;
    });
    var shareSDK = require('U/shareSDK');
    var actionID = api.pageParam.actionID;
    var UIChatBox = api.require('UIChatBox');
    var UserInfo = _g.getLS('UserInfo');
    var directory = 'message';
    var Http = require('U/http');
    var marketType = api.pageParam.marketType;
    var zanKey = 0;
    var zanIndex = 0;
    var messageDetail = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/detail-main-V'),
        data: {
            showReplay: false,
            showFigure: false,
            winWidth: '',
            winHeight: '',
            caiAction: false,
            zanAction: false,
            colAction: false,
            // showHobby:true,
            showContent:true,
            showLine:false,
            // showContent2:true,
            showThinks:false,
            detail: {
                showNow: true,
                showReady: false,
                showDone: false,
                userID: '',
                avatar: '',
                nickName: '',
                content: '',
                thinks:'',
                figure: '',
                likeImages: [],
                timeText: '',
                colNum: 0,
                cmtNum: 0,
                caiNum: 0,
                zanNum: 0,
                hobby: '',
                type: 0,
            },
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
            caiObj: [{
                userID: '',
                avatar: '',
                addDate: '',
                lastTime: ''
            }],
            favObj: [{
                userID: '',
                avatar: '',
                addDate: '',
                lastTime: ''
            }],
            likeAvatar: [{
                id: 0,
                image: '',
            }],
            commentList: [{
                id: 0,
                commentAvatar: '',
                commentTime: '',
                commentName: '',
                commentContent: '',
                replyName: '',
                replyContent: '',
            }],
            collect: '../../image/message/message-collect.png',
            like: '../../image/message/message-like.png',
            unlike: '../../image/message/message-unlike.png'
        },
        created: function() {
            this.commentList = [];
            this.detail = {};
            // if(marketType == 1) {
            //     this.showHobby = false;
            //     this.showContent = true;
            //     this.showContent2 = false;
            //     this.showThinks = true;
            // }else {
            //     this.showHobby = true;
            //     this.showContent = false;
            //     this.showContent2 = true;
            //     this.showThinks = false;
            // }
            if(marketType == 1) {
                this.showLine = true;
                this.showContent = false;
            }else {
                this.showLine = false;
                this.showContent = true;
            }
        },
        methods: {
            onBodyTap: function() {
                UIChatBox.hide();
                UIChatBox.closeKeyboard();
            },
            onPicTap: function(index) {
                this.winWidth = api.winWidth + "px";
                this.winHeight = api.winWidth + "px";
                messageDetail.detail.figure = messageDetail.detail.likeImages[index];
            },
            onOthersPageTap: function() {
                if (messageDetail.detail.userID == UserInfo.userID) {
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
                            userID: messageDetail.detail.userID,
                        }
                    });
                } else {
                    _g.openWin({
                        header: {
                            data: {
                                title: messageDetail.detail.nickName,
                            }
                        },
                        name: 'privacy-othersPage',
                        url: '../privacy/othersPage.html',
                        bounces: false,
                        slidBackEnabled: false,
                        pageParam: {
                            userID: messageDetail.detail.userID,
                        }
                    });
                }
            },
            onCommentTap: function() {
                setTimeout(function() {
                    UIChatBox.popupKeyboard();
                }, 50);
                UIChatBox.open({
                    placeholder: '',
                    maxRows: 4,
                    autoFocus: true,
                    emotionPath: 'widget://res/emotion',
                    texts: {
                        recordBtn: {
                            normalTitle: '按住说话',
                            activeTitle: '松开结束'
                        },
                        sendBtn: {
                            title: 'send'
                        }
                    },
                    styles: {
                        inputBar: {
                            borderColor: '#d9d9d9',
                            bgColor: '#f2f2f2'
                        },
                        inputBox: {
                            borderColor: '#B3B3B3',
                            bgColor: '#FFFFFF'
                        },
                        emotionBtn: {
                            normalImg: 'widget://res/emotion/smileFace.png'
                        },
                        keyboardBtn: {
                            normalImg: 'widget://res/emotion/keybord.png'
                        },
                        sendBtn: {
                            titleColor: '#4cc518',
                            bg: '#999999',
                            activeBg: '#46a91e',
                            titleSize: 14
                        }
                    },
                }, function(ret, err) {
                    if (ret.eventType == 'send') {
                        messageDetail.commentList.commentContent = ret.msg;
                        if (ret.msg == '') {
                            _g.toast('你还没有输入任何内容哦~');
                        } else {
                            Http.ajax({
                                data: {
                                    userID: UserInfo.userID,
                                    actionID: actionID,
                                    content: messageDetail.commentList.commentContent,
                                },
                                // isSync: true,
                                url: '/action/postComment',
                                success: function(ret) {
                                    if (ret.code == 200) {
                                        getData();

                                    }
                                },
                                error: function(err) {}
                            });
                        }
                    } else {}
                });
            },
            onUnlikeTap: function() {
                if(messageDetail.zanAction == true){
                    _g.toast('不能同时点赞点踩哦~');
                }else {
                    _g.commonAction(UserInfo.userID, actionID, 2, Http, messageDetail.detail.caiNum, messageDetail.caiAction, function() {
                        if (messageDetail.caiAction == true) {
                            messageDetail.unlike = '../../image/message/message-unlike.png';
                            messageDetail.detail.caiNum = messageDetail.detail.caiNum - 1;
                            messageDetail.caiAction = false;
                        } else if (messageDetail.caiAction == false) {
                            messageDetail.unlike = '../../image/message/icon-unlike.png';
                            messageDetail.detail.caiNum = messageDetail.detail.caiNum + 1;
                            messageDetail.caiAction = true;
                        }
                    });
                }
            },
            onLiketap: function() {
                if(messageDetail.caiAction == true){
                    _g.toast('不能同时点赞点踩哦~');
                }else {
                    _g.commonAction(UserInfo.userID, actionID, 1, Http, messageDetail.detail.zanNum, messageDetail.zanAction, function() {
                        if (messageDetail.zanAction == true) {
                            messageDetail.like = '../../image/message/message-like.png';
                            messageDetail.detail.zanNum = messageDetail.detail.zanNum - 1;
                            messageDetail.likeAvatar.splice(zanIndex - 1, 1);
                            messageDetail.zanAction = false;
                        } else if (messageDetail.zanAction == false) {
                            messageDetail.like = '../../image/message/icon-like.png';
                            messageDetail.detail.zanNum = messageDetail.detail.zanNum + 1;
                            var obj = {
                                image: CONFIG.HOST + _g.getLS('UserInfo').avatar,
                                id: _g.getLS('UserInfo').userID
                            }
                            messageDetail.likeAvatar.push(obj);
                            messageDetail.zanAction = true;
                        }
                    });
                }
            },
            onCollectTap: function() {
                _g.commonAction(UserInfo.userID, actionID, 3, Http, messageDetail.detail.colNum, messageDetail.colAction, function() {
                    if (messageDetail.colAction == true) {
                        messageDetail.collect = '../../image/message/message-collect.png';
                        messageDetail.detail.colNum = messageDetail.detail.colNum - 1;
                        messageDetail.colAction = false;
                    } else if (messageDetail.colAction == false) {
                        messageDetail.collect = '../../image/message/icon-collect.png';
                        messageDetail.detail.colNum = messageDetail.detail.colNum + 1;
                        messageDetail.colAction = true;
                    }
                });
            },
            onShareTap: function() {
                shareSDK.init();
                shareSDK.openShare();
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
                actionID: actionID,
            },
            isSync: true,
            url: '/action/getActionDetail',
            success: function(ret) {
                if (ret.code == 200) {
                    setTimeout(function() {
                        messageDetail.detail = machDetail(ret.data);
                        //展示星星
                        if (ret.data.avgEvaNum > 0) {
                            _.each(messageDetail.stars, function(n, i) {
                                if (i <= ret.data.avgEvaNum - 1) {
                                    n.pic = '../../image/message/index-star.png';
                                }
                            });
                        }
                        messageDetail.likeAvatar = machLikeAvatar(ret.data.zanObj);
                        messageDetail.commentList = machCommentList(ret.data.cmtObj);
                        messageDetail.caiObj = machCaiObj(ret.data.caiObj);
                        messageDetail.favObj = machFavObj(ret.data.favObj);
                    }, 0);
                    if (ret.data.images.length == 0) {
                        messageDetail.showFigure = false;
                    } else {
                        messageDetail.showFigure = true;
                    }
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }


    function changeValue(type,data,value) {
        switch (Number(value)) {
            case 1:
                var text = "餐饮";
                break;
            case 2:
                var text = "运动";
                break;
            case 3:
                var text = "衣着";
                break;
            case 4:
                var text = "娱乐";
                break;
            case 5:
                var text = "交通";
                break;
            case 6:
                var text = "住宿";
                break;
            case 7:
                var text = "工作";
                break;
            case 8:
                var text = "学习";
                break;
            case 9:
                var text = "购物";
                break;
            case 10:
                var text = "家务";
                break;
            case 11:
                var text = "社交";
                break;
            case 12:
                var text = "啪啪";
                break;
            case 13:
                var text = "亲子";
                break;
            case 14:
                var text = "睡觉";
                break;
            case 15:
                var text = "其他";
                break;
        }
        //判断当前的活动是准备进行，还是正在进行，还是已经结束
        // var end = new Date(data.endTime.replace(/-/g, '/')).getTime();
        // var start = new Date(data.startTime.replace(/-/g, '/')).getTime();
        var end = data.endTime;
        var start = data.startTime;
        var now = new Date().getTime();
        if (now > end) {
            messageDetail.detail.showNow = false;
            if(type){
                return text;
            }else{
                return false;
            }
        } else if (now > start && now < end) {
            messageDetail.detail.showNow = true;
            if(type){
                return '正在'+text;
            }else{
                return true;
            }
        } else {
            messageDetail.detail.showNow = false;
            if(type){
                return '准备'+text;
            }else{
                return false;
            }
        }
    }

    function machDetail(data) {
        //判断当前的活动是准备进行，还是正在进行，还是已经结束
        return {
            showNow: changeValue(0,data,data.actType),
            userID: data.userInfo.userID,
            avatar: CONFIG.HOST + data.userInfo.avatar,
            nickName: data.userInfo.name,
            content: data.content,
            thinks:data.thinks,
            likeImages: data.images,
            timeText: data.lastTime,
            cmtNum: Number(data.cmtNum),
            caiNum: Number(data.caiNum),
            zanNum: Number(data.zanNum),
            colNum: Number(data.favNum),
            figure: data.images[0],
            hobby: data.userInfo.hobbies || '这个家伙很懒，什么都没写~',
            type: changeValue(1,data,data.actType),
        }
    }

    function machLikeAvatar(data) {
        return _.map(data, function(item, index) {
            zanKey++;
            if (item.userID == UserInfo.userID) {
                messageDetail.zanAction = true;
                zanIndex = zanKey;
                messageDetail.like = '../../image/message/icon-like.png';
            }
            return {
                image: CONFIG.HOST + item.avatar,
                id: item.userID,
            }
        });
    }

    function machCommentList(data) {
        return _.map(data, function(item) {
            return {
                id: item.userID,
                commentAvatar: CONFIG.HOST + item.avatar,
                commentTime: item.lastTime,
                commentContent: replyToImage(item.content),
                commentName: item.name,
            }
        });
    }

    function machCaiObj(data) {
        return _.map(data, function(item) {
            if (item.userID == UserInfo.userID) {
                messageDetail.caiAction = true;
                messageDetail.unlike = '../../image/message/icon-unlike.png';
            }
            return {
                userID: item.userID,
                avatar: item.avatar,
                addDate: item.addDate,
                lastTime: item.lastTime
            }
        });
    }

    function machFavObj(data) {
        return _.map(data, function(item) {
            if (item.userID == UserInfo.userID) {
                messageDetail.colAction = true;
                messageDetail.collect = '../../image/message/icon-collect.png';
            }
            return {
                userID: item.userID,
                avatar: item.avatar,
                addDate: item.addDate,
                lastTime: item.lastTime
            }
        });
    }

    getData();

    function openMenu() {
        var mnPopups = api.require('MNPopups');
        mnPopups.open({
            rect: {
                w: 125,
                h: 120
            },
            position: {
                x: api.winWidth - 17,
                y: 68
            },
            styles: {
                mask: 'rgba(0,0,0,0.2)',
                bg: '#343530',
                cell: {
                    bg: {
                        normal: '#343530',
                        highlight: '#343530'
                    },
                    h: 40,
                    title: {
                        marginL: 40,
                        color: '#fff',
                        size: 14,
                    },
                    icon: {
                        marginL: 10,
                        w: 19,
                        h: 19,
                        corner: 2
                    }
                },
                pointer: {
                    size: 7,
                    xPercent: 90,
                    yPercent: 0,
                    orientation: 'downward'
                }
            },
            datas: [{
                title: '发起聊天',
                icon: 'widget://image/common/group-chat.png'
            }, {
                title: '加为好友',
                icon: 'widget://image/common/add-friend.png'
            }, {
                title: '发布资讯',
                icon: 'widget://image/common/post-news.png'
            }],
            animation: true
        }, function(ret) {

        });
    }
    //监听右上角按钮
    api.addEventListener({
        name: 'message-detail-barMenu'
    }, function(ret, err) {
        openMenu();
    });
});
