"use strict";
exports.__esModule = true;
exports.simpleFilterProcessQuery = exports.simpleFilterProcessParams = void 0;
function simpleFilterProcessParams(filterState, params) {
    var alias = filterState.config.alias;
    if (Array.isArray(params[alias])) {
        filterState.value = params[alias];
        filterState.hasValue = true;
    }
    else if (params[alias]) {
        filterState.value = [params[alias]];
        filterState.hasValue = true;
    }
    else {
        filterState.value = [];
        filterState.hasValue = false;
    }
}
exports.simpleFilterProcessParams = simpleFilterProcessParams;
function simpleFilterProcessQuery(filterState, query) {
    var solrField = filterState.config.solrField;
    var field = solrField === 'q' ? '' : solrField + ":";
    query.q = filterState.hasValue ? "" + field + filterState.value[0] + "*" : '*';
}
exports.simpleFilterProcessQuery = simpleFilterProcessQuery;
