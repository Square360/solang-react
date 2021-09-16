"use strict";
exports.__esModule = true;
exports.filterProcessParams = void 0;
/**
 * Updates internal filter state in response to changes in parameters
 * @param filterState
 * @param params
 */
var filterProcessParams = function (filterState, params) {
    var alias = filterState.config.alias;
    var selected;
    if (Array.isArray(params[alias])) {
        selected = params[alias];
        filterState.hasValue = true;
    }
    else if (params[alias]) {
        selected = [params[alias]];
        filterState.hasValue = true;
    }
    else {
        selected = [];
        filterState.hasValue = false;
    }
    filterState.value = selected;
};
exports.filterProcessParams = filterProcessParams;
