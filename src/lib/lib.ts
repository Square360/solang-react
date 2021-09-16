import {
  // Redux
  SolangSlice,
  SolangReducer,
  // Helper functions
  getAppFromState,
  getFilterFromState,
  createEmptySolrQuery,
  // Filters
  createApp,
  setParam,
  setParams,
  buildQuery,
  sendQuery,
  refreshResults,
  resultsReceived,
  processFacetFilter,
  processSimpleFilter,
  processPager,
  processSort
} from './solang/store/solang.slice';

import { SolangEpic }  from './solang/store/solang.epic';

import { createSolrQueryObs, prepareQuery } from "./solang/solang.api";

import FacetCheckbox from "./solang/components/FacetCheckbox/FacetCheckbox";
import SolangFacet from './solang/components/SolangFacet/SolangFacet';
import SimplePager from "./solang/components/SimplePager/SimplePager";
import SortSelect from "./solang/components/SortSelect/SortSelect";


export {
  SolangEpic,
  // Redux
  SolangReducer,
  SolangSlice,
  getAppFromState,
  getFilterFromState,
  createEmptySolrQuery,
  // Helper functions
  createSolrQueryObs,
  prepareQuery,
  createApp,
  // App Reducers
  setParam,
  setParams,
  buildQuery,
  sendQuery,
  refreshResults,
  resultsReceived,
  // Filter Reduces
  processFacetFilter,
  processSimpleFilter,
  processPager,
  processSort,
  // Components
  FacetCheckbox,
  SolangFacet,
  SortSelect,
  SimplePager
};


import {
  // Types
  ISolangState,
  ICreateAppPayload,
  ISetParamsPayload,
  ISetParamPayload,
  IBuildQueryPayload,
  iSendQueryPayload,
  IResultsReceivedPayload,
  IProcessFilterPayload
} from './solang/store/solang.slice';

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
