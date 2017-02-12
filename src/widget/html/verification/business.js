define(function(require, exports, module) {

    var directory = 'verification';
    new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/business-main-V'),
        data: {},
        methods: {
            focus: function ( event ) {
                if (event.target.tagName != 'INPUT') {
                    event.target.querySelector('input').focus();
                    event.preventDefault();
                }
            },
        },
    });
});
