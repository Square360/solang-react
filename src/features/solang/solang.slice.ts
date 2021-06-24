import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISolangApp, ISolangParamList, SolangState, ISolrQuery, ISolrResults } from "./solang.types";
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
  const filter = app.filters[filterAlias] ?? null;
  if (!filter) {
    console.log(`Filter ${filterAlias} on app ${appId} doesn't exist!`);
  }
  return filter;
}

/**
 * Returns a filter state from the solr slice
 * @param state
 * @param appId
 * @param filterAlias
 */
export const getFacetCountsFromState = (state: SolangState, appId: string, filterAlias: string) => {
  const app = getAppFromState(state, appId);
  const filter = getFilterFromState(state, appId, filterAlias);
  if (app.response && app.response.facet_counts ) {
    const solrField: string = filter.config.solrField;
    if (app.response.facet_counts.facet_fields[solrField]) {
      const counts = app.response.facet_counts.facet_fields[solrField];
      return Object.keys(app.response.facet_counts.facet_fields[solrField]).map( (value: string) => {
        return {value: value, count: counts[value]}
      });
    }
  }
  return [];
}

export const createEmptySolrQuery = (): ISolrQuery => {
  return {
    q: '*',
    facet: 'true',
    'facet.field': [],
    fq: [],
    legacy: {}
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
  params: ISolangParamList
};

export interface ISetParamPayload {
  appId: string,
  key: string,
  value: string | string[]
};

export interface IBuildQueryPayload {
  appId: string,
  query: ISolrQuery
};

export interface iSendQueryPayload {
  appId: string;
  query: ISolrQuery;
}

export interface IResultsReceivedPayload {
  appId: string;
  results: ISolrResults;
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
    createApp: (state: SolangState, action: PayloadAction<ISolangApp>) => {
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
      const app: ISolangApp = state.apps[appId];
      app.params = action.payload.params;
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
      const app: ISolangApp = state.apps[appId];
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
  setParam,
  setParams,
  buildQuery,
  sendQuery,
  resultsReceived,
  processFacetFilter,
  processSimpleFilter
} = SolangSlice.actions;


export default SolangSlice.reducer;

