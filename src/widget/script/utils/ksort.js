define(function(require, exports, module) {

	function ksort(a,b){var e,f,g,c={},d=[],h=this,i=!1,j={};switch(b){case"SORT_STRING":e=function(a,b){return h.strnatcmp(a,b)};break;case"SORT_LOCALE_STRING":var k=this.i18n_loc_get_default();e=this.php_js.i18nLocales[k].sorting;break;case"SORT_NUMERIC":e=function(a,b){return a+0-(b+0)};break;default:e=function(a,b){var c=parseFloat(a),d=parseFloat(b),e=c+""===a,f=d+""===b;return e&&f?c>d?1:d>c?-1:0:e&&!f?1:!e&&f?-1:a>b?1:b>a?-1:0}}for(g in a)a.hasOwnProperty(g)&&d.push(g);for(d.sort(e),this.php_js=this.php_js||{},this.php_js.ini=this.php_js.ini||{},i=this.php_js.ini["phpjs.strictForIn"]&&this.php_js.ini["phpjs.strictForIn"].local_value&&"off"!==this.php_js.ini["phpjs.strictForIn"].local_value,j=i?a:j,f=0;f<d.length;f++)g=d[f],c[g]=a[g],i&&delete a[g];for(f in c)c.hasOwnProperty(f)&&(j[f]=c[f]);return i||j}

    module.exports = ksort;

});