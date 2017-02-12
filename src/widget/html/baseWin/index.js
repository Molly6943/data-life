define(function(require, exports, module) {

    var opts = api && api.pageParam.opts;
    var Func = require('U/func');
    opts.header.methods = opts.header.methods || Func.get(opts.name);
    _g.addHeader(opts.header);
    _g.addContent(opts);

    module.exports = {};

});
