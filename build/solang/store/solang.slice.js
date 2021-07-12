import { createSlice } from '@reduxjs/toolkit';
import { facetFilterProcessParams, facetFilterProcessQuery } from "../filters/FacetFilter";
import { simpleFilterProcessParams, simpleFilterProcessQuery } from "../filters/SimpleFilter";
//////////////////////////////////////
// Helper Functions
//////////////////////////////////////
/**
 * Returns a reference to the app with the given appId in the given state, throwing an error if none found.
 * @param state
 * @param appId
 */
export const getAppFromState = (state, appId) => {
    let app = state.apps[appId];
    if (!app) {
        // ToDo: Throw Error
        // throw new Error(`App ${appId} doesn't exist!`);
        console.log(`App ${appId} doesn't exist!`);
    }
    return app;
};
/**
 * Returns a filter state from the solr slice
 * @param state
 * @param appId
 * @param filterAlias
 */
export const getFilterFromState = (state, appId, filterAlias) => {
    var _a;
    const app = getAppFromState(state, appId);
    const filter = (_a = app.filters[filterAlias]) !== null && _a !== void 0 ? _a : null;
    if (!filter) {
        console.log(`Filter ${filterAlias} on app ${appId} doesn't exist!`);
    }
    return filter;
};
export const createEmptySolrQuery = () => {
    return {
        q: '*',
        facet: 'true',
        'facet.field': [],
        fq: [],
        legacy: {}
    };
};
//////////////////////////////////////
// Solang Slice
//////////////////////////////////////
const initialState = {
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
        createApp: (state, action) => {
            if (!state.apps[action.payload.id]) {
                state.apps[action.payload.id] = Object.assign(Object.assign({}, action.payload), { query: createEmptySolrQuery() });
            }
            else {
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
        setParams: (state, action) => {
            const appId = action.payload.appId;
            const app = state.apps[appId];
            app.params = action.payload.params;
        },
        /**
         * Update a single parameter in an application
         * @param state
         * @param action
         */
        setParam: (state, action) => {
            const appId = action.payload.appId;
            const app = state.apps[appId];
            app.params[action.payload.key] = action.payload.value;
        },
        /**
         * Usually triggered after params have been changed. Resets an application query. buildQueryEpic will execute
         * filter process functions to build the query before updating via sendQuery.
         * @param state
         * @param action
         */
        buildQuery: (state, action) => {
            console.log('buildQuery reducer', action);
            const app = getAppFromState(state, action.payload.appId);
            app.lastQuery = app.query || {};
            app.query = createEmptySolrQuery();
        },
        /**
         * Stores a query. sendQueryEpic will then initiate the solr request and store result in resultsReceived
         * @param state
         * @param action
         */
        sendQuery: (state, action) => {
            console.log('sendQuery reducer', action);
        },
        /**
         * Updates results from a solr query to the application state
         * @param state
         * @param action
         */
        resultsReceived: (state, action) => {
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
        processFacetFilter: (state, action) => {
            let app = getAppFromState(state, action.payload.appId);
            if (app) {
                facetFilterProcessParams(app.filters[action.payload.filter], app.params);
                facetFilterProcessQuery(app.filters[action.payload.filter], app.query || createEmptySolrQuery());
            }
        },
        /**
         * processSimpleFilter reducer
         * @param state
         * @param action
         */
        processSimpleFilter: (state, action) => {
            let app = getAppFromState(state, action.payload.appId);
            if (app) {
                simpleFilterProcessParams(app.filters[action.payload.filter], app.params);
                simpleFilterProcessQuery(app.filters[action.payload.filter], app.query || createEmptySolrQuery());
            }
        }
    }
});
export const { createApp, setParam, setParams, buildQuery, sendQuery, resultsReceived, processFacetFilter, processSimpleFilter } = SolangSlice.actions;
export const SolangReducer = SolangSlice.reducer;
//# sourceMappingURL=solang.slice.js.map