define(function(require, exports, module) {

    function Func() {
        this['search-index'] = {
            onSearchInput: function() {
                api.sendEvent({
                    name: 'index-search-searchInput',
                    extra: {
                        inputValue: this.searchText
                    }
                });
            },
            onEnter: function() {
                api.sendEvent({
                    name: 'search-index-enter',
                    extra: {
                        inputValue: this.searchText
                    }
                });
            },
            onTapRightBtn: function() {
                api.closeWin();
            }
        };
        this['setting-user'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'setting-user-save',
                });
            }
        };
        this['message-index'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'message-index-edit',
                });
            }
        };
        this['me-answer'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'me-answer-edit',
                });
            }
        };
        this['message-detail'] = {
            onMenuTap: function() {
                api.sendEvent({
                    name: 'message-detail-barMenu'
                });
            }
        };
        this['privacy-bank'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'privacy-bank-openMenu'
                });
            }
        };
        this['privacy-taskChart'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'privacy-taskChart-actionSheet'
                });
            }
        };
        this['privacy-trajectory'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'privacy-trajectory-actionSheet'
                });
            }
        };
        this['account-information'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'account-information-save'
                });
            }
        };
        this['privacy-information-nickname'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'privacy-nickname-save'
                });
            }
        };
        this['privacy-information-region'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'privacy-region-save'
                });
            }
        };
        this['privacy-information-phone'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'privacy-phone-save'
                });
            }
        };
        this['privacy-information-company'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'privacy-company-save'
                });
            }
        };
        this['privacy-information-industry'] = {
            onTapRightBtn: function() {
                api && api.closeWin();
                api.sendEvent({
                    name: 'privacy-industry-save'
                });
            }
        };
        this['privacy-information-workyear'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'privacy-workyear-save'
                });
            }
        };
        this['privacy-information-experience'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'privacy-workExp-save'
                });
            }
        };
        this['privacy-information-profile'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'privacy-profile-save'
                });
            }
        };
        this['privacy-information-hobby'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'privacy-hobby-save'
                });
            }
        };
        this['privacy-taskDetail'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'privacy-taskDetail-cancel'
                });
            }
        };
        this['activity-publish'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'activity-publish-public'
                });
            }
        };
        this['activity-information'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'activity-information-public'
                });
            }
        };
    }

    Func.prototype = {
        get: function(page) {
            return this[page] || {}
        }
    };

    Func.prototype.constructor = Func;

    module.exports = new Func();

});
