"use strict";
exports.__esModule = true;
exports.customFilterProcessQuery = exports.customFilterProcessParams = void 0;
var solang_slice_1 = require("../store/solang.slice");
function customFilterProcessParams(app, filterId, params) {
    var filterState = solang_slice_1.getFilterFromApp(app, filterId);
    var alias = filterState.config.alias;
    if (params[alias]) {
        filterState.value = params[alias];
    }
    else {
        filterState.value = '';
    }
}
exports.customFilterProcessParams = customFilterProcessParams;
var customFilterProcessQuery = function (filterState, query) {
    var translatedValue = filterState.config.process(filterState.value);
    query.q = translatedValue;
};
exports.customFilterProcessQuery = customFilterProcessQuery;
