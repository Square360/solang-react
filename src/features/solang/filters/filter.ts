import { SolangParamList, SolrQuery } from "../solang.types";
import { PayloadAction } from "@reduxjs/toolkit";
import { IFacetFilterState } from "./FacetFilter";

export interface IFacetOption {
  value: string;
  count: number;
}

export interface IFilterState {
  // Filter config
  config: any;
  // Contains a list ofn actions which should be executed on this filter during query process
  processQueryActions: string[];
  //
  value: any
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


export const filterProcessParams = function (filterState: IFacetFilterState, params: SolangParamList) {

  const alias = filterState.config.alias;
  let selected: string[];

  if ( Array.isArray(  params[ alias ] ) ) {
    selected = params[ alias ] as string[];
    filterState.hasValue = true;
  }
  else if ( params[ alias ] ) {
    selected = [ params[ alias ] ] as string[];
    filterState.hasValue = true;
  }
  else {
    selected = [];
    filterState.hasValue = false;
  }

  filterState.value = selected;
}


