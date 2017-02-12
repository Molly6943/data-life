define(function(require, exports, module) {

    function Cache() {
        // 是否第一次打开APP
        this.isFirstStart = true;
        // 用户信息
        this.UserInfo = {
            user_id: 0, // 用户ID
            session_key: '', // 用户session_key
            business_area_id: 0, // 所属商圈ID
            business_area_name: '' // 所属商圈名称
        };
        // 用户商圈信息, 是一个数组
        this.BusinessInfo = [];
        // 当前选择商圈
        this.CurrentBusiness = {};
        // 搜索历史记录
        this.SearchHistoryInfo = [];
        // 搜索历史记录 索引
        this.SearchHistoryInfoIndex = {};
        // 游客uuid
        this.UUID = '';
        // 省市区数据
        this.Region = [];
        // 省市区数据ID
        this.RegionID = {};
        // 省市区数据ID对应名称
        this.RegionText = {};
        // 是否需要加载省市区数据
        this.needLoadRegion = 'true';
        // 浏览记录数据
        this.browseHistory = [
            {   //日期对象
                isDateChecked: false, //日期选中按钮状态
                date: '2014-05-02', //日期
                list: [ //同一日期下的商品列表
                    {   //商品信息对象
                        title: '美国钛合金镶钻超豪华超舒爽纸尿裤1', //商品标题
                        img: 'http://usr.im/175x150', //商品图片
                        origPrice: '100.00', //原价
                        nowPrice: '68.00', //现价
                        discount: '6.8', //折扣
                        isChecked: false, //商品选中按钮状态
                        id: '', //商品id
                    },
                ]
            }, 
            {   
                isDateChecked: false, //日期选中按钮状态
                date: '2016-05-23', //日期
                list: [
                    {
                        title: '美国钛合金镶钻超豪华超舒爽纸尿裤11111111111111111111111111111', //商品标题
                        img: 'http://usr.im/175x150', //商品图片
                        origPrice: '100.00', //原价
                        nowPrice: '68.00', //现价
                        discount: '6.8', //折扣
                        isChecked: false, //商品选中按钮状态
                        id: '', //商品id
                    }, 
                ]
            }, 
        ];
        // 购物车操作记录
        this.CartHistory = {
            '123': 1
        };
    }

    Cache.prototype = {

    };

    Cache.prototype.constructor = Cache;

    module.exports = new Cache();

});
