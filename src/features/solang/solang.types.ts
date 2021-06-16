
export interface SolrQuery {}
export interface SolrResults {}

export interface SolangParamList { [key: string]: string | string[] }

export interface  SolangFilter {
  alias: string;
  field: string;
  label?: string;
  process: (params: SolangParamList, query: {}) => {};
}

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

export interface SolangState {
  config: {}
  apps: SolangAppList
}


