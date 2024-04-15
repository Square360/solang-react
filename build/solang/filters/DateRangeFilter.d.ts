import { ISolangApp, ISolangParamList, ISolrQuery } from "../solang.types";
export interface IDateRangeFilterConfig {
    solrField: string;
    alias: string;
    label: string;
}
export interface IDateRangeState {
    from?: string;
    to?: string;
    config: IDateRangeFilterConfig;
}
export declare function dateRangeFilterProcessParams(app: ISolangApp, filterId: string, params: ISolangParamList): void;
export declare function dateRangeFilterProcessQuery(filterState: IDateRangeState, query: ISolrQuery): void;
