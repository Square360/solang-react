import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {ISolangApp, ISolangParamList, SolangState, ISolrQuery, ISolrResponse, ISolangAppConfig} from "../solang.types";
import { facetFilterProcessParams, facetFilterProcessQuery, IFacetFilterState } from "../filters/FacetFilter";
import { simpleFilterProcessParams, simpleFilterProcessQuery } from "../filters/SimpleFilter";
import { IFilterState } from "../filters/filter";
import { ISimplePagerState, simplePagerProcessParams, simplePagerProcessQuery } from "../filters/SimplePager";
import { ISortState, sortProcessParams, sortProcessQuery } from "../filters/Sort";

//////////////////////////////////////
// Helper Functions
//////////////////////////////////////

/**
 * Returns a reference to the app with the given appId in the given state, throwing an error if none found.
 * @param state
 * @param appId
 */
export const getAppFromState = (state: SolangState, appId: string) => {
  let app = state.apps[appId];
  if (!app) {
    // ToDo: Throw Error
    // throw new Error(`App ${appId} doesn't exist!`);
    console.log(`App ${appId} doesn't exist!`);
  }
  return app;
}

/**
 * Returns a filter state from the solr slice
 * @param state
 * @param appId
 * @param filterAlias
 */
export const getFilterFromState = (state: SolangState, appId: string, filterAlias: string) => {
  const app = getAppFromState(state, appId);
  return getFilterFromApp(app, filterAlias)
}

export const getFilterFromApp = (app: ISolangApp, filterAlias: string) => {
  const filter = app.filters[filterAlias] ?? null;
  if (!filter) {
    console.log(`Filter ${filterAlias} on app ${app.id} doesn't exist!`);
  }
  return filter;

}

export const createEmptySolrQuery = (): ISolrQuery => {
  return {
    q: '*',
    facet: 'true',
    'facet.field': [],
    fq: [],
    legacy: {},
    fl: [],
    start: 0,
    rows: 10
  }
}

export interface ISolangState {
  solang: SolangState
}


//////////////////////////////////////
// Action & Payload interfaces
//////////////////////////////////////

/**
 * Interfaces
 */

export interface ICreateAppPayload {
  id: string;
  endpoint: string;
  config?: ISolangAppConfig,
  params: ISolangParamList, // url-like paramerers
  filters: { [key: string]: IFilterState }; // A definition of all filters keyed by alias
}

export interface ISetParamsPayload {
  appId: string,
  params: ISolangParamList
}

export interface ISetParamPayload {
  appId: string,
  key: string,
  value: string | string[]
}

export interface IBuildQueryPayload {
  appId: string,
  query: ISolrQuery
}

export interface iSendQueryPayload {
  appId: string;
  query: ISolrQuery;
}

export interface IResultsReceivedPayload {
  appId: string;
  results: ISolrResponse;
}

export interface IProcessFilterPayload {
  appId: string;
  filter: string;
}


//////////////////////////////////////
// Solang Slice
//////////////////////////////////////

const initialState: SolangState = {
  config: {},
  apps: {},
};


export const SolangSlice = createSlice({
  name: 'solang',
  initialState,
  reducers: {

    //////////////////////////////////////
    // Application reducers
    //////////////////////////////////////

    /**
     * Create a solr application
     * @param state
     * @param action
     */
    createApp: (state: SolangState, action: PayloadAction<ICreateAppPayload>) => {

      if (!state.apps[action.payload.id]) {
        state.apps[action.payload.id] = {
          ...action.payload,
          query: createEmptySolrQuery(),
        };

      } else {
        throw Error(`Solang app ${action.payload.id} already exists!`);
      }
    },

    //////////////////////////////////////
    // Query lifecycle reducers
    //////////////////////////////////////

    /**
     * Set an application's parameters (eg when a user selects a search option)
     * @param state
     * @param action
     */
    setParams: (state: SolangState, action: PayloadAction<ISetParamsPayload>) => {
      const appId = action.payload.appId;
      const app: ISolangApp = state.apps[appId];
      app.params = action.payload.params;

      if (app?.config?.setQuery) {
        app.config.setQuery(app.params, 'push');
      }
    },

    /**
     * Update a single parameter in an application
     * @param state
     * @param action
     */
    setParam: (state: SolangState, action: PayloadAction<ISetParamPayload>) => {
      const appId = action.payload.appId;
      const app: ISolangApp = state.apps[appId];
      app.params[action.payload.key] = action.payload.value;
      if (app?.config?.setQuery) {
        app.config.setQuery(app.params);
      }
    },

    /**
     * Usually triggered after params have been changed. Resets an application query. buildQueryEpic will execute
     * filter process functions to build the query before updating via sendQuery.
     * @param state
     * @param action
     */
    buildQuery: (state: SolangState, action: PayloadAction<IBuildQueryPayload>) => {
      console.log('buildQuery reducer', action);
      console.log('Setting URL params');


      const app = getAppFromState(state, action.payload.appId)
      app.lastQuery = app.query || {};
      app.query = createEmptySolrQuery();
    },

    /**
     * Stores a query. sendQueryEpic will then initiate the solr request and store result in resultsReceived
     * @param state
     * @param action
     */
    sendQuery: (state: SolangState, action: PayloadAction<iSendQueryPayload>) => {
      console.log('sendQuery reducer', action);
    },

    /**
     * Updates results from a solr query to the application state
     * @param state
     * @param action
     */
    resultsReceived: (state: SolangState, action: PayloadAction<any>) => {
      console.log('resultsReceived', action);
      const app = state.apps[action.payload.appId];
      app.response = action.payload.response.response;
    },

    //////////////////////////////////////
    // Filter reducers
    //////////////////////////////////////

    /**
     * processQueryFacet reducer.
     * @param state
     * @param action
     */
    processFacetFilter: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => {
      let app = getAppFromState(state, action.payload.appId);
      if (app) {
        facetFilterProcessParams(app.filters[action.payload.filter] as IFacetFilterState, app.params);
        facetFilterProcessQuery(app.filters[action.payload.filter] as IFacetFilterState, app.query || createEmptySolrQuery());
      }
    },

    /**
     * processSimpleFilter reducer
     * @param state
     * @param action
     */
    processSimpleFilter: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => {
      let app = getAppFromState(state, action.payload.appId);
      if (app) {
        simpleFilterProcessParams(app.filters[action.payload.filter] as IFacetFilterState, app.params);
        simpleFilterProcessQuery(app.filters[action.payload.filter] as IFacetFilterState, app.query || createEmptySolrQuery());
      }
    },

    /**
     * processSimpleSearch reducer
     * @param state
     * @param action
     */
    processPager: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => {
      let app = getAppFromState(state, action.payload.appId);
      simplePagerProcessParams(app, action.payload.filter, app.params);
      simplePagerProcessQuery(app.filters[action.payload.filter] as ISimplePagerState, app.query || createEmptySolrQuery());
    },

    processSort: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => {
      let app = getAppFromState(state, action.payload.appId);
      sortProcessParams(app, action.payload.filter, app.params);
      sortProcessQuery(app.filters[action.payload.filter] as ISortState, app.query || createEmptySolrQuery());
    }
  }
});

export const {
  createApp,
  setParam,
  setParams,
  buildQuery,
  sendQuery,
  resultsReceived,
  processFacetFilter,
  processSimpleFilter,
  processPager,
  processSort
} = SolangSlice.actions;


export const SolangReducer = SolangSlice.reducer;

