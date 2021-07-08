"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleFilterProcessQuery = exports.simpleFilterProcessParams = void 0;
function simpleFilterProcessParams(filterState, params) {
    const alias = filterState.config.alias;
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
    const solrField = filterState.config.solrField;
    const field = solrField === 'q' ? '' : `${solrField}:`;
    query.q = filterState.hasValue ? `${field}${filterState.value[0]}*` : '*';
}
exports.simpleFilterProcessQuery = simpleFilterProcessQuery;
//# sourceMappingURL=SimpleFilter.js.map