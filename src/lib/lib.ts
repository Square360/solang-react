import {
  // Types
  ISolangState,
  ICreateAppPayload,
  ISetParamsPayload,
  ISetParamPayload,
  IBuildQueryPayload,
  iSendQueryPayload,
  IResultsReceivedPayload,
  IProcessFilterPayload,
  // Redux
  SolangSlice,
  SolangReducer,
  // Helper functions
  getAppFromState,
  getFilterFromState,
  createEmptySolrQuery,
  // Filters
  processFacetFilter,
  processSimpleFilter
} from './solang/store/solang.slice';

import { createSolrQueryObs, prepareQuery } from "./solang/solang.api";

import SolangFacet from './solang/components/SolangFacet/SolangFacet';

export {
  // Redux
  SolangReducer,
  SolangSlice,
  getAppFromState,
  getFilterFromState,
  createEmptySolrQuery,
  SolangFacet,
  // Helper functions
  createSolrQueryObs,
  prepareQuery,
  // Filters
  processSimpleFilter,
  processFacetFilter
};

// Types
export type {
  ISolangState,
  ICreateAppPayload,
  ISetParamsPayload,
  ISetParamPayload,
  IBuildQueryPayload,
  iSendQueryPayload,
  IResultsReceivedPayload,
  IProcessFilterPayload
};

