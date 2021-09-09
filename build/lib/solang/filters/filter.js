/**
 * Updates internal filter state in response to changes in parameters
 * @param filterState
 * @param params
 */
export const filterProcessParams = function (filterState, params) {
    const alias = filterState.config.alias;
    let selected;
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
//# sourceMappingURL=filter.js.map