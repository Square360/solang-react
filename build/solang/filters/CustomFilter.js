import { getFilterFromApp } from "../store/solang.slice";
export function customFilterProcessParams(app, filterId, params) {
    const filterState = getFilterFromApp(app, filterId);
    const alias = filterState.config.alias;
    if (params[alias]) {
        filterState.value = params[alias];
    }
    else {
        filterState.value = '';
    }
}
export const customFilterProcessQuery = function (filterState, query) {
    const translatedValue = filterState.config.process(filterState.value);
    query.q = translatedValue;
};
//# sourceMappingURL=CustomFilter.js.map