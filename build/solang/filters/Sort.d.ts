import { ISolangApp, ISolangParamList, ISolrQuery } from "../solang.types";
import { IFilterState } from "./filter";
export interface ISortConfig {
    alias: string;
    options: Array<{
        label: string;
        value: string;
    }>;
    default?: string;
}
export interface ISortState extends IFilterState {
    config: ISortConfig;
    value?: string;
}
export declare function sortProcessParams(app: ISolangApp, filterId: string, params: ISolangParamList): void;
export declare function sortProcessQuery(filterState: ISortState, query: ISolrQuery): void;
