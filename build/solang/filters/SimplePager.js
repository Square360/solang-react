import { getAppFromState, getFilterFromApp } from "../store/solang.slice";
;
export function simplePagerProcessParams(app, filterId, params) {
    const filter = getFilterFromApp(app, filterId);
    const alias = filter.config.alias;
    let value;
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
export function simplePagerProcessQuery(filterState, query) {
    query.start = filterState.value * filterState.config.rows;
    query.rows = filterState.config.rows;
}
export function getCountFromResponse(state, appId) {
    var _a;
    const app = getAppFromState(state, appId);
    return ((_a = app.response) === null || _a === void 0 ? void 0 : _a.response.numFound) || 0;
}
//# sourceMappingURL=SimplePager.js.map