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
 * ISolangApp contains config, parameters, filters & results pertaining to a single solang application.
 */
export interface ISolangApp {
    id: string;
    endpoint?: string;
    status?: 'idle' | 'loading' | 'failed';
    config?: {};
    params: ISolangParamList;
    filters: {
        [key: string]: IFilterState;
    };
    response?: ISolrResponse;
    query: ISolrQuery;
    lastQuery?: {};
}
export interface ISolrResponse {
    responseHeader: any;
    response: {
        numFound: number;
        start: number;
        numFoundExact?: boolean;
        docs: any[];
    };
    facet_counts?: {
        facet_queries: {
            [key: string]: number;
        };
        facet_fields: {
            [key: string]: any;
        };
        facet_ranges: {
            [key: string]: any;
        };
        facet_intervals: {
            [key: string]: any;
        };
        facet_heatmaps: {
            [key: string]: any;
        };
    };
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
