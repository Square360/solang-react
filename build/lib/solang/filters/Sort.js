import { getFilterFromApp } from "../store/solang.slice";
;
export function sortProcessParams(app, filterId, params) {
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
        value = '';
    }
    filter.value = value;
}
export function sortProcessQuery(filterState, query) {
    if (filterState.value !== '') {
        const sortItem = filterState.config.options.find(i => i.value === filterState.value);
        if (sortItem) {
            query.sort = sortItem.value;
        }
    }
    else {
        if (filterState.config.default) {
            const sortItem = filterState.config.options.find(i => i.label === filterState.config.default);
            if (sortItem) {
                query.sort = sortItem.value;
            }
        }
    }
}
//# sourceMappingURL=Sort.js.map