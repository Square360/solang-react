"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSimpleFilter = exports.processFacetFilter = exports.resultsReceived = exports.sendQuery = exports.buildQuery = exports.setParams = exports.setParam = exports.createApp = exports.SolangSlice = exports.createEmptySolrQuery = exports.getFilterFromState = exports.getAppFromState = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const FacetFilter_1 = require("../filters/FacetFilter");
const SimpleFilter_1 = require("../filters/SimpleFilter");
//////////////////////////////////////
// Helper Functions
//////////////////////////////////////
/**
 * Returns a reference to the app with the given appId in the given state, throwing an error if none found.
 * @param state
 * @param appId
 */
const getAppFromState = (state, appId) => {
    let app = state.apps[appId];
    if (!app) {
        // ToDo: Throw Error
        // throw new Error(`App ${appId} doesn't exist!`);
        console.log(`App ${appId} doesn't exist!`);
    }
    return app;
};
exports.getAppFromState = getAppFromState;
/**
 * Returns a filter state from the solr slice
 * @param state
 * @param appId
 * @param filterAlias
 */
const getFilterFromState = (state, appId, filterAlias) => {
    var _a;
    const app = exports.getAppFromState(state, appId);
    const filter = (_a = app.filters[filterAlias]) !== null && _a !== void 0 ? _a : null;
    if (!filter) {
        console.log(`Filter ${filterAlias} on app ${appId} doesn't exist!`);
    }
    return filter;
};
exports.getFilterFromState = getFilterFromState;
const createEmptySolrQuery = () => {
    return {
        q: '*',
        facet: 'true',
        'facet.field': [],
        fq: [],
        legacy: {}
    };
};
exports.createEmptySolrQuery = createEmptySolrQuery;
//////////////////////////////////////
// Solang Slice
//////////////////////////////////////
const initialState = {
    config: {},
    apps: {},
};
exports.SolangSlice = toolkit_1.createSlice({
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
                state.apps[action.payload.id] = Object.assign(Object.assign({}, action.payload), { query: exports.createEmptySolrQuery() });
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
            const app = exports.getAppFromState(state, action.payload.appId);
            app.lastQuery = app.query || {};
            app.query = exports.createEmptySolrQuery();
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
            let app = exports.getAppFromState(state, action.payload.appId);
            if (app) {
                FacetFilter_1.facetFilterProcessParams(app.filters[action.payload.filter], app.params);
                FacetFilter_1.facetFilterProcessQuery(app.filters[action.payload.filter], app.query || exports.createEmptySolrQuery());
            }
        },
        /**
         * processSimpleFilter reducer
         * @param state
         * @param action
         */
        processSimpleFilter: (state, action) => {
            let app = exports.getAppFromState(state, action.payload.appId);
            if (app) {
                SimpleFilter_1.simpleFilterProcessParams(app.filters[action.payload.filter], app.params);
                SimpleFilter_1.simpleFilterProcessQuery(app.filters[action.payload.filter], app.query || exports.createEmptySolrQuery());
            }
        }
    }
});
_a = exports.SolangSlice.actions, exports.createApp = _a.createApp, exports.setParam = _a.setParam, exports.setParams = _a.setParams, exports.buildQuery = _a.buildQuery, exports.sendQuery = _a.sendQuery, exports.resultsReceived = _a.resultsReceived, exports.processFacetFilter = _a.processFacetFilter, exports.processSimpleFilter = _a.processSimpleFilter;
exports.default = exports.SolangSlice.reducer;
//# sourceMappingURL=solang.slice.js.map