define(function(require, exports, module) {

    var directory = 'business';

    new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/businessIndex-main-V'),
        data: {
            list:[{
                text:'我的邀请'
            },{
                text:'接受邀请'
            },{
                text:'发邀请码'
            },{
                text:'业务规则'
            },{
                text:'活动规则'
            },]
        },
        methods: {
        },
    });
});
