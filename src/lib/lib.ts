import {
  // Redux
  SolangSlice,
  SolangReducer,
  // Helper functions
  getAppFromState,
  getFilterFromState,
  getFilterFromApp,
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
  processCustomFilter,
  processPager,
  processSort
} from './solang/store/solang.slice';

import { SolangEpic }  from './solang/store/solang.epic';

import { createSolrQueryObs, prepareQuery } from "./solang/solang.api";

import FacetCheckbox from "./solang/components/FacetCheckbox/FacetCheckbox";
import SolangFacet from './solang/components/SolangFacet/SolangFacet';
import SimplePager from "./solang/components/SimplePager/SimplePager";
import SortSelect from "./solang/components/SortSelect/SortSelect";
import SortRadio from "./solang/components/SortRadio/SortRadio";
import OptionsList from "./solang/components/OptionsList/OptionsList";
import {facetFilterGetCountsFromAppState, IFacetFilterState} from "./solang/filters/FacetFilter";

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


export {
  SolangEpic,
  // Redux
  SolangReducer,
  SolangSlice,
  getAppFromState,
  getFilterFromApp,
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
  processCustomFilter,
  processPager,
  processSort,
  // Filter helpers
  facetFilterGetCountsFromAppState,
  // Components
  FacetCheckbox,
  OptionsList,
  SolangFacet,
  SortSelect,
  SortRadio,
  SimplePager
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
  IProcessFilterPayload,
  IFacetFilterState,
};
