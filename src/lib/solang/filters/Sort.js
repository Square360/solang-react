"use strict";
exports.__esModule = true;
exports.sortProcessQuery = exports.sortProcessParams = void 0;
var solang_slice_1 = require("../store/solang.slice");
;
function sortProcessParams(app, filterId, params) {
    var filter = solang_slice_1.getFilterFromApp(app, filterId);
    var alias = filter.config.alias;
    var value;
    if (Array.isArray(params[alias])) {
        value = params[alias][0];
    }
    else if (params[alias]) {
        value = params[alias];
    }
    else {
        value = '';
    }
    filter.value = value;
}
exports.sortProcessParams = sortProcessParams;
function sortProcessQuery(filterState, query) {
    if (filterState.value !== '') {
        var sortItem = filterState.config.options.find(function (i) { return i.value === filterState.value; });
        if (sortItem) {
            query.sort = sortItem.value;
        }
    }
    else {
        if (filterState.config["default"]) {
            var sortItem = filterState.config.options.find(function (i) { return i.label === filterState.config["default"]; });
            if (sortItem) {
                query.sort = sortItem.value;
            }
        }
    }
}
exports.sortProcessQuery = sortProcessQuery;
