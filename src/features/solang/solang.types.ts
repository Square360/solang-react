
/**
 * ToDo: Must fill out SolrQuery
 */
export interface SolrQuery {}

/**
 * ToDo: Must fill out SolrResults
 */
export interface SolrResults {}

/**
 * Defines possible parameters for a single search application. These should be compatible with URL query values.
 */
export interface SolangParamList { [key: string]: string | string[] }

/**
 * Filters will make their individual changes to the application query during the build phase.
 * The process should modify the query based on current params and the filter's own variables.
 * ToDo: To make SolangFilter testable we have to refactor into a class (or extract the process into a pure function)
 * ToDo: SolangFilter should be extended to other classes/interfaces which define configurable options
 */
export interface  SolangFilter {
  alias: string;
  field: string;
  label?: string;
  process: (params: SolangParamList, query: {}) => {};
  config?: any;
}

/**
 * SolangApp contains config, parameters, filters & results pertaining to a single solang application.
 */
export interface SolangApp {
  id: string;
  endpoint?: string; // Maybe should be an object
  status?: 'idle' | 'loading' | 'failed',
  config?: {},
  params: SolangParamList, // url-like paramerers
  filters?: SolangFilter[]; // A definition of all filters
  results?: any[], // Define response object
  query?: {},
  lastQuery?: {},
}

export interface SolangAppList { [key: string]: SolangApp }

/**
 * State definition for the redux slice
 */
export interface SolangState {
  config: {}
  apps: SolangAppList
}


