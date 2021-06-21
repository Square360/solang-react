import { SolangParamList, SolrQuery } from "../solang.types";
import { PayloadAction } from "@reduxjs/toolkit";

export interface IFacetOption {
  value: string;
  count: number;
}

export interface IFilterState {
  // Filter config
  config: any;
  // Contains a list ofn actions which should be executed on this filter during query process
  processQueryActions: string[];
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




