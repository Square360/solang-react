import { SolangParamList, SolrQuery } from "../solang.types";

export interface IFacetOption {
  value: string;
  count: number;
}

export interface IParamProcessor {
  processParams(params: SolangParamList): void;
}

/**
 * @param query
 */
export interface IQueryProcessor {
  processQuery(query: SolrQuery): void;
}




