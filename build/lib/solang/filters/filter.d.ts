import { ISolangParamList, ISolrQuery } from "../solang.types";
import { IFacetFilterState } from "./FacetFilter";
export interface IFacetOption {
    value: string;
    count: number;
}
export interface IFilterState {
    config: any;
    processQueryActions: string[];
    value?: any;
}
export interface IParamProcessor {
    processParams(params: ISolangParamList): void;
}
/**
 * @param query
 */
export interface IQueryProcessor {
    processQuery(query: ISolrQuery): void;
}
/**
 * Updates internal filter state in response to changes in parameters
 * @param filterState
 * @param params
 */
export declare const filterProcessParams: (filterState: IFacetFilterState, params: ISolangParamList) => void;
