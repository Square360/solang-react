import { IFacetOption, IFilterState } from "./filter";
import { ISolangParamList, ISolrQuery, SolangState } from "../solang.types";
export interface IFacetFilterConfig {
    solrField: string;
    alias: string;
    excludeTag: boolean;
    sortAlpha: boolean;
    limit: number;
    minCount: number;
    isOr?: boolean;
    missingLabel?: string;
}
export interface IFacetFilterState extends IFilterState {
    config: IFacetFilterConfig;
    value: string[];
    options: IFacetOption[];
    hasValue: boolean;
}
export declare const facetFilterProcessParams: (filterState: IFacetFilterState, params: ISolangParamList) => void;
export declare const facetFilterProcessQuery: (filterState: IFacetFilterState, query: ISolrQuery) => void;
/**
 * Given a filter config & solr query, add the arguments which will request facet options
 * @param query
 */
export declare function facetFilterAddFacetField(config: IFacetFilterConfig, query: ISolrQuery): void;
export declare function facetFilterAddQuery(filterState: IFacetFilterState, query: ISolrQuery): void;
export interface IFormattedFacetOption {
    value: string;
    count: number;
}
/**
 * Returns possible facet options for the given filter.
 * @param state
 * @param appId
 * @param filterAlias
 */
export declare const facetFilterGetCountsFromState: (state: SolangState, appId: string, filterAlias: string) => IFormattedFacetOption[];
