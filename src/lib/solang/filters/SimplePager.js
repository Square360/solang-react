"use strict";
exports.__esModule = true;
exports.getCountFromResponse = exports.simplePagerProcessQuery = exports.simplePagerProcessParams = void 0;
var solang_slice_1 = require("../store/solang.slice");
;
function simplePagerProcessParams(app, filterId, params) {
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
        value = 0;
    }
    filter.value = (typeof value === 'string') ? parseInt(value) : value;
}
exports.simplePagerProcessParams = simplePagerProcessParams;
function simplePagerProcessQuery(filterState, query) {
    query.start = filterState.value * filterState.config.rows;
    query.rows = filterState.config.rows;
}
exports.simplePagerProcessQuery = simplePagerProcessQuery;
function getCountFromResponse(state, appId) {
    var _a;
    var app = solang_slice_1.getAppFromState(state, appId);
    return ((_a = app.response) === null || _a === void 0 ? void 0 : _a.response.numFound) || 0;
}
exports.getCountFromResponse = getCountFromResponse;
