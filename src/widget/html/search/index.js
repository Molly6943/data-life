define(function(require, exports, module) {
    var aMap = api.require('aMap');
    var map = require('U/map');
    var UserInfo = _g.getLS('UserInfo');
    var Http = require('U/http');
    var directory = 'search';

    var searchIndex = new Vue({
        el: '#main',
        template: _g.getTemplate(directory + '/index-main-V'),
        data: {
            searchText: '',
            showSearchFocus: 0,
            showSearchDefaule: 1,
            showSearchResponse: 0,
            list: [{
                avatar: '',
                name: 'molly',
            }]
        },
        methods: {
            onSearchTypeTap: function() {
                this.showSearchFocus = 0;
                this.showSearchDefaule = 0;
                this.showSearchResponse = 1;
            },
            onActivityTap: function(type) {
                searchData(type);
            },
            onInfoTap: function(type) {
                searchData(type);
            },
            onFriendTap: function(type) {
                searchData(type);
            },
            onIDtap: function(type) {
                searchData(type);
                this.showSearchFocus = false;
                this.showSearchResponse = true;
                this.showSearchDefaule = false;
            },
            onActionTap: function(type) {
                searchData(type);
                this.showSearchFocus = false;
                this.showSearchResponse = true;
                this.showSearchDefaule = false;
            },
            onOthersPageTap: function() {
                
            }
        },
    });

    function searchData(type) {
        Http.ajax({
            data: {
                searchText: searchIndex.searchText,
                type: type,
            },
            isSync: true,
            url: '/search/searchList',
            success: function(ret) {
                if (ret.code == 200) {
                    searchIndex.list = machData(ret.data);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function machData(data) {
        return _.map(data, function(item) {
            return {
                avatar: item.avatar,
                name: item.name,
            }
        });
    }

    //点击键盘搜索按钮
    api.addEventListener({
        name: 'search-index-enter',
    }, function(ret, err) {
        searchIndex.searchText = ret.value.inputValue;
        searchData(6);
        searchIndex.showSearchFocus = false;
        searchIndex.showSearchResponse = true;
        searchIndex.showSearchDefaule = false;
    });
    //监听拿到输入的文本
    api.addEventListener({
        name: 'index-search-searchInput'
    }, function(ret, err) {
        searchIndex.searchText = ret.value.inputValue;
        searchIndex.showSearchFocus = 1;
        searchIndex.showSearchDefaule = 0;
        searchIndex.showSearchResponse = 0;
    });

});
