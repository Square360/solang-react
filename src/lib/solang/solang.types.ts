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
  // Allows for use of field-value-facet parameters while maintaining strict typing. These must be moved into the
  // top-level of the query before sending to Solr
  // https://solr.apache.org/guide/8_1/faceting.html#field-value-faceting-parameters
  // See JSON Facet API for an alternative https://solr.apache.org/guide/8_1/json-facet-api.html
  legacy: { [key: string]: string | string[] }
}

/**
 * Defines possible parameters for a single search application. These should be compatible with URL query values.
 */
export interface ISolangParamList { [key: string]: string | string[] }

/**
 * ISolangApp contains config, parameters, filters & results pertaining to a single solang application.
 */
export interface ISolangApp {
  // Unique identifier for this solang micro app.
  id: string;
  // Solr endpoint
  endpoint?: string;
  // Currently unused
  status?: 'idle' | 'loading' | 'failed',
  // Currently unused
  config?: {},
  // Current search parameters. Parameters define the current search {search: scotland, category: news}
  params: ISolangParamList, // url-like paramerers
  filters: { [key: string]: IFilterState };
  response?: ISolrResponse,
  query: ISolrQuery,
  lastQuery?: {},
}

export interface ISolrResponse {
  responseHeader: any,
  response: {
    numFound: number;
    start: number;
    numFoundExact?: boolean;
    docs: any[];
  },
  facet_counts?: {
    facet_queries: { [key: string]: number };
    facet_fields: { [key: string]: any };
    facet_ranges: { [key: string]: any };
    facet_intervals: { [key: string]: any };
    facet_heatmaps: { [key: string]: any };
  }
  "highlighting"?: any;
  "debug"?: any;
}

export interface SolangAppList { [key: string]: ISolangApp }

/**
 * State definition for the redux slice
 */
export interface SolangState {
  config: {}
  apps: SolangAppList
}

