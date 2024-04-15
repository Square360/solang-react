import { getFilterFromApp } from "../store/solang.slice";
export function dateRangeFilterProcessParams(app, filterId, params) {
    var _a, _b;
    const filterState = getFilterFromApp(app, filterId);
    const alias = filterState.config.alias;
    const fromIndex = `${alias}From`;
    const toIndex = `${alias}To`;
    filterState.from = (_a = params[fromIndex]) !== null && _a !== void 0 ? _a : null;
    filterState.to = (_b = params[toIndex]) !== null && _b !== void 0 ? _b : null;
}
export function dateRangeFilterProcessQuery(filterState, query) {
    const solrField = filterState.config.solrField;
    const fromDate = filterState.from ? new Date(filterState.from).toISOString() : '*';
    const toDate = filterState.to ? new Date(filterState.to).toISOString() : '*';
    const queryValue = `[ ${fromDate} TO ${toDate}]`;
    query.fq.push(`${solrField}:${queryValue}`);
}
//# sourceMappingURL=DateRangeFilter.js.map