define(function(require, exports, module) {

    var directory = 'privacy';

    var cash = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/bank-cash-main-V'),
        data: {
            money:'',
        },
        methods: {
            onMoneyInput: function() {
                
            }
        },
    });
});
