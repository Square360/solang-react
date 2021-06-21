import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createEmptySolrQuery, SolangApp, SolangParamList, SolangState, SolrQuery, SolrResults } from "./solang.types";
import { facetFilterProcessParams, facetFilterProcessQuery, IFacetFilterState } from "./filters/FacetFilter";
import { simpleFilterProcessParams, simpleFilterProcessQuery } from "./filters/SimpleFilter";

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
  if (app) {
    return app;
  }
  else {
    // ToDo: Throw Error
    console.log(`App ${appId} doesn't exist!`);
  }
}

//////////////////////////////////////
// Action & Payload interfaces
//////////////////////////////////////

/**
 * Interfaces
 */
export interface ISetParamsPayload {
  appId: string,
  params: SolangParamList
};

export interface IBuildQueryPayload {
  appId: string,
  query: SolrQuery
};

export interface iSendQueryPayload {
  appId: string;
  query: SolrQuery;
}

export interface IResultsReceivedPayload {
  appId: string;
  results: SolrResults;
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
    createApp: (state: SolangState, action: PayloadAction<SolangApp>) => {
      if (!state.apps[action.payload.id]) {
        state.apps[action.payload.id] = action.payload
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
      const app: SolangApp = state.apps[appId];
      app.params = action.payload.params;
    },


    /**
     * Usually triggered after params have been changed. Resets an application query. buildQueryEpic will execute
     * filter process functions to build the query before updating via sendQuery.
     * @param state
     * @param action
     */
    buildQuery: (state: SolangState, action: PayloadAction<any>) => {
      console.log('buildQuery reducer', action);
      const appId = action.payload.appId;
      const app: SolangApp = state.apps[appId];
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
      app.results = action.payload.response.response.response.docs;
    },

    //////////////////////////////////////
    // Filter reducers
    //////////////////////////////////////

    /**
     * processQueryFacet reducer see: facetFilterProcessParams
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

    processSimpleFilter: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => {
      let app = getAppFromState(state, action.payload.appId);
      if (app) {
        simpleFilterProcessParams(app.filters[action.payload.filter] as IFacetFilterState, app.params);
        simpleFilterProcessQuery(app.filters[action.payload.filter] as IFacetFilterState, app.query || createEmptySolrQuery());
      }
    }

  }
});

export const {
  createApp,
  setParams,
  buildQuery,
  sendQuery,
  resultsReceived,
  processFacetFilter,
  processSimpleFilter
} = SolangSlice.actions;


export default SolangSlice.reducer;

