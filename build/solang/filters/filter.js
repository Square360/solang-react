"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterProcessParams = void 0;
/**
 * Updates internal filter state in response to changes in parameters
 * @param filterState
 * @param params
 */
const filterProcessParams = function (filterState, params) {
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
exports.filterProcessParams = filterProcessParams;
//# sourceMappingURL=filter.js.map