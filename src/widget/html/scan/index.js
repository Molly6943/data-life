define(function(require, exports, module) {
    var storehouseId = api && api.pageParam.storehouseId;
    var win_name = api && api.pageParam.win_name;
    var FNScanner = api.require('FNScanner');
    var Http = require('U/http');
    var scanBody = new Vue({
        el: '#scanBody',
        template: _g.getTemplate('scan/index-body-V'),
        data: {
            show: false
        },
        methods: {

        }
    });

    setTimeout(function() {
        openScanner();
    }, 100);

    api.addEventListener({
        name: 'openScanner'
    }, function(ret, err) {
        openScanner();
    });

    api.addEventListener({
        name: 'hideScanner'
    }, function(ret, err) {
        hideScanner();
    });

    function openScanner() {
        FNScanner.openView({
            rect: {
                x: 0,
                y: api.winHeight - api.frameHeight,
            }
        }, function(ret) {
            if (ret.eventType == 'show') {
                showScanner();
            } else if (ret.eventType == 'success') {
                matchContent(ret.content);
            } else if (ret.eventType == 'fail') {

            }
        });
    }

    function showScanner() {
        // 安卓优化
        if (api.systemType == 'android') {
            setTimeout(function() {
                api.bringFrameToFront({
                    from: 'scan-index-frame'
                });
            }, 500);

            setTimeout(function() {
                scanBody.show = true;
            }, 1000);

            return;
        }
        // ios正常处理
        api.bringFrameToFront({
            from: 'scan-index-frame'
        });
        scanBody.show = true;
    }

    // 扫描成功 调用
    function matchContent(content) {
        // if (Number(content) + '' != 'NaN') {
        //     // 扫描结果是数字
        //     if (win_name == 'shop-inventoryCheckeditorSearch-win' || win_name == 'shop-inventorycheck-win' || win_name == 'shop-inventorycheckeditor-win') {
        //         getInventory(content);
        //         //如果窗口的名字是库存成本查询，
        //     } else if (win_name == 'shop-goodsCostCheck-win') {
        //         getGoodsCostCheck(content);
        //         // 如果窗口的名字是商品流水查询商品列表
        //     } else if (win_name == 'shop-commodityflowqueryGoodsList-win') {
        //         getGoodFlowForScan(content);
        //     }
        // } else {
        //     // 校验是否网址
        //     // var urlReg = /^(http|https|ftp)\:\/\/)$/;
        //     var urlReg = /(http|https|ftp)/;
        //     if (urlReg.test(content)) {
        //         if (content.indexOf('company_id') < 0 || content.indexOf('id') < 0) {
        //             _g.toast('没有匹配的商品信息');
        //         } else {
        //             var params = content.split('?')[1].split('&');
        //             var business_area_id = 0;
        //             var goods_id = 0;
        //             _.each(params, function(item) {
        //                 var param = item.split('=');
        //                 if (param[0] == 'company_id') business_area_id = param[1];
        //                 if (param[0] == 'id') goods_id = param[1];
        //             });
        //             if (business_area_id && goods_id) {
        //                 openDetailPage(business_area_id, goods_id);
        //             } else {
        //                 _g.toast('没有匹配的商品信息');
        //             }
        //         }
        //     } else {
        //         _g.toast('没有匹配的商品信息');
        //     }
        // }

        //数字,数字&字母,数字&字母&符号
        // if (win_name == 'shop-inventoryCheckeditorSearch-win' || win_name == 'shop-inventorycheck-win' || win_name == 'shop-inventorycheckeditor-win') {
        //     getInventory(content);
        //     //如果窗口的名字是库存成本查询，
        // } else if (win_name == 'shop-goodsCostCheck-win') {
        //     getGoodsCostCheck(content);
        //     // 如果窗口的名字是商品流水查询商品列表
        // } else if (win_name == 'shop-commodityflowqueryGoodsList-win') {
        //     getGoodFlowForScan(content);
        // }
    }
    //商品流水查询
    // var getGoodFlowForScan = function(content) {
    //     Http.ajax({
    //         data: {
    //             query_name: content,
    //             storehouse_id: storehouseId
    //         },

    //         isSync:true,
    //         url: '/app/auth/page/product/listForStockChangeLog.do',
    //         success: function(ret) {
    //             if (ret.code == 200) {
    //                 showScanner();
    //                 if (!ret.object) {
    //                     _g.toast('没有匹配的商品信息');
    //                     return
    //                 }
    //                 if (ret.object.product == null) {
    //                     _g.toast('找不到该商品信息');
    //                     return
    //                 }
    //                 // var business_area_id = ret.object.business_area_id;
    //                 var goods_id = ret.object.product.product_id;
    //                 if (!goods_id) {
    //                     _g.toast('没有匹配的商品信息');
    //                     return
    //                 }
    //                 if (win_name == 'shop-commodityflowqueryGoodsList-win') {
    //                     api && api.sendEvent({
    //                         name: 'refresh-commodityflowqueryGoodsList',
    //                         extra: {
    //                             query_name: content,
    //                             storehouse_id: storehouseId
    //                         }
    //                     });
    //                 }
    //                 api && api.closeWin();
    //             } else {
    //                 _g.toast(ret.message);
    //             }
    //         },
    //         error: function(err) {},
    //     });
    // }

    //库存成本查询
    // function getGoodsCostCheck(content) {
    //     Http.ajax({
    //         data: {
    //             query_name: content
    //         },

    //         isSync:true,
    //         url: '/app/auth/page/erp/stockList.do',
    //         success: function(ret) {
    //             if (ret.code == 200) {
    //                 showScanner();
    //                 if (!ret.object) {
    //                     _g.toast('没有匹配的商品信息');
    //                     return
    //                 }
    //                 if (ret.object.lists.length < 1) {
    //                     _g.toast('找不到该商品信息');
    //                     return
    //                 }
    //                 // var business_area_id = ret.object.business_area_id;
    //                 var goods_id = ret.object.lists[0].product_id;
    //                 if (!goods_id) {
    //                     _g.toast('没有匹配的商品信息');
    //                     return
    //                 }
    //                 if (win_name == 'shop-goodsCostCheck-win') {
    //                     api && api.sendEvent({
    //                         name: 'refresh-goodsCostCheck',
    //                         extra: {
    //                             query_name: content
    //                         }
    //                     });
    //                 }
    //                 api && api.closeWin();
    //             } else {
    //                 _g.toast('网络出小差');
    //             }
    //         },
    //         error: function(err) {},
    //     });
    // }

    // function openDetailPage(business_area_id, goods_id) {
    //     _g.openWin({
    //         header: {
    //             data: {
    //                 title: '商品详情'
    //             }
    //         },
    //         name: 'item-detail',
    //         url: '../item/detail.html',
    //         pageParam: {
    //             business_area_id: business_area_id,
    //             goods_id: goods_id
    //         }
    //     });
    // }


    //查询库存盘点
    // function getInventory(content) {
    //     Http.ajax({
    //         data: {
    //             query_name: content,
    //             storehouse_id: storehouseId,
    //         },

    //         isSync:true,
    //         url: '/app/auth/page/product/listCheckOrder.do',
    //         success: function(ret) {
    //             if (ret.code == 200) {
    //                 showScanner();
    //                 if (!ret.object) {
    //                     _g.toast('没有匹配的商品信息');
    //                     return
    //                 }
    //                 if (ret.object.lists.length < 1) {
    //                     _g.toast('找不到该商品信息');
    //                     return
    //                 }
    //                 // var business_area_id = ret.object.business_area_id;
    //                 var goods_id = ret.object.lists[0].product_id;
    //                 if (!goods_id) {
    //                     _g.toast('没有匹配的商品信息');
    //                     return
    //                 }
    //                 if (win_name == 'shop-inventoryCheckeditorSearch-win') {
    //                     api && api.sendEvent({
    //                         name: 'shop-inventoryCheckeditorSearch',
    //                         extra: {
    //                             searchText: content,
    //                             storehouseId: storehouseId
    //                         }
    //                     });
    //                     setTimeout(function() {
    //                         api && api.closeWin();
    //                     }, 1000);
    //                 } else if (win_name == 'shop-inventorycheck-win') {
    //                     //判断原来的窗口是新增盘点单
    //                     _g.closeWins(['shop-inventoryCheckeditorSearch']);
    //                     _g.openWin({
    //                         header: {
    //                             data: {
    //                                 title: '',
    //                                 isSearchInput: false,
    //                                 searchText: '',
    //                                 storehouseId: storehouseId
    //                             },
    //                             template: '../html/main/searchflow-header-V',
    //                         },
    //                         name: 'shop-inventoryCheckeditorSearch',
    //                         url: '../shop/inventoryCheckeditorSearch.html',
    //                         bounces: false,
    //                         slidBackEnabled: false,
    //                         pageParam: {
    //                             storehouseId: storehouseId,
    //                             query_name: content,
    //                             win_name: win_name
    //                         }
    //                     });
    //                 }
    //                  else if (win_name == 'shop-inventorycheckeditor-win') {
    //                     _g.closeWins(['shop-inventoryCheckeditorSearch']);
    //                     _g.openWin({
    //                         header: {
    //                             data: {
    //                                 title: '',
    //                                 isSearchInput: false,
    //                                 searchText: '',
    //                                 storehouseId: storehouseId
    //                             },
    //                             template: '../html/main/searchflow-header-V',
    //                         },
    //                         name: 'shop-inventoryCheckeditorSearch',
    //                         url: '../shop/inventoryCheckeditorSearch.html',
    //                         bounces: false,
    //                         slidBackEnabled: false,
    //                         pageParam: {
    //                             storehouseId: storehouseId,
    //                             query_name: content,
    //                             win_name: win_name
    //                         }
    //                     });
    //                 } 
    //                 // else if (win_name == 'shop-inventorycheckeditor-win') {
    //                 //     // _g.closeWins();
    //                 //     _g.closeWins(['shop-inventorycheckeditorScan-win']);
    //                 //     _g.openWin({
    //                 //         header: {
    //                 //             data: {
    //                 //                 title:'编辑盘点单',
    //                 //                 // isSearchInput: false,
    //                 //                 // searchText: '',
    //                 //                 storehouseId: storehouseId
    //                 //             }
    //                 //         },
    //                 //         name:'shop-inventoryCheckeditorScan',
    //                 //         url:'../shop/inventoryCheckeditorScan.html',
    //                 //         bounces:false,
    //                 //         slidBackEnabled:false,
    //                 //         pageParam:{
    //                 //             storehouseId:storehouseId,
    //                 //             query_name:content,
    //                 //             win_name:win_name
    //                 //         }
    //                 //     });
    //                 // }
    //             } else {
    //                 _g.toast('网络出小差');
    //             }
    //         },
    //         error: function(err) {},
    //     });

    // }

    module.exports = {};

});