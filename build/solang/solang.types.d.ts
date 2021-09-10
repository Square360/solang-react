/**
 * ToDo: We still have to expand on the ISolrQuery interface
 */
import { IFilterState } from "./filters/filter";
export interface ISolrQuery {
    q: string;
    facet?: 'true' | 'false';
    'facet.field': string[];
    fq: string[];
    wt?: string;
    'json.facet'?: string | {};
    'json.nl'?: string;
    start: number;
    rows: number;
    sort?: string;
    fl: string[];
    legacy: {
        [key: string]: string | string[];
    };
}
/**
 * Defines possible parameters for a single search application. These should be compatible with URL query values.
 */
export interface ISolangParamList {
    [key: string]: string | string[];
}
/**
 * Configuration object for Solang Application
 */
export interface ISolangAppConfig {
    externalParams?: boolean;
    setQuery?: any;
}
/**
 * Default configuration for Solang Application
 */
export declare const SolangAppConfigDefaults: ISolangAppConfig;
/**
 * ISolangApp contains config, parameters, filters & results pertaining to a single solang application.
 */
export interface ISolangApp {
    id: string;
    endpoint?: string;
    status?: 'idle' | 'loading' | 'failed';
    config?: ISolangAppConfig;
    params: ISolangParamList;
    filters: {
        [key: string]: IFilterState;
    };
    response?: ISolrResponse;
    query: ISolrQuery;
    lastQuery?: {};
}
export interface ISolrFacetQueries {
    [key: string]: number;
}
export interface ISolrFacetField {
    [key: string]: number;
}
export interface ISolrFacetFields {
    [key: string]: ISolrFacetField;
}
export interface ISolrFacetCounts {
    facet_queries: ISolrFacetQueries;
    facet_fields: ISolrFacetFields;
    facet_ranges: any;
    facet_intervals: any;
    facet_heatmaps: any;
}
export interface ISolrResponse {
    responseHeader: any;
    response: {
        numFound: number;
        start: number;
        numFoundExact?: boolean;
        docs: any[];
    };
    facet_counts?: ISolrFacetCounts;
    "highlighting"?: any;
    "debug"?: any;
}
export interface SolangAppList {
    [key: string]: ISolangApp;
}
/**
 * State definition for the redux slice
 */
export interface SolangState {
    config: {};
    apps: SolangAppList;
}
