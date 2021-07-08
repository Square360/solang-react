export function simpleFilterProcessParams(filterState, params) {
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
export function simpleFilterProcessQuery(filterState, query) {
    const solrField = filterState.config.solrField;
    const field = solrField === 'q' ? '' : `${solrField}:`;
    query.q = filterState.hasValue ? `${field}${filterState.value[0]}*` : '*';
}
//# sourceMappingURL=SimpleFilter.js.map