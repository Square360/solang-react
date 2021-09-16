"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
exports.__esModule = true;
exports.SolangReducer = exports.processSort = exports.processPager = exports.processCustomFilter = exports.processSimpleFilter = exports.processFacetFilter = exports.resultsReceived = exports.refreshResults = exports.sendQuery = exports.buildQuery = exports.setParams = exports.setParam = exports.createApp = exports.SolangSlice = exports.createEmptySolrQuery = exports.getFilterFromApp = exports.getFilterFromState = exports.getAppFromState = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var FacetFilter_1 = require("../filters/FacetFilter");
var SimpleFilter_1 = require("../filters/SimpleFilter");
var SimplePager_1 = require("../filters/SimplePager");
var Sort_1 = require("../filters/Sort");
var CustomFilter_1 = require("../filters/CustomFilter");
//////////////////////////////////////
// Helper Functions
//////////////////////////////////////
/**
 * Returns a reference to the app with the given appId in the given state, throwing an error if none found.
 * @param state
 * @param appId
 */
var getAppFromState = function (state, appId) {
    var app = state.apps[appId];
    if (!app) {
        // ToDo: Throw Error
        // throw new Error(`App ${appId} doesn't exist!`);
        console.log("App " + appId + " doesn't exist!");
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
var getFilterFromState = function (state, appId, filterAlias) {
    var app = exports.getAppFromState(state, appId);
    return exports.getFilterFromApp(app, filterAlias);
};
exports.getFilterFromState = getFilterFromState;
var getFilterFromApp = function (app, filterAlias) {
    var _a;
    var filter = (_a = app.filters[filterAlias]) !== null && _a !== void 0 ? _a : null;
    if (!filter) {
        console.log("Filter " + filterAlias + " on app " + app.id + " doesn't exist!");
    }
    return filter;
};
exports.getFilterFromApp = getFilterFromApp;
var createEmptySolrQuery = function () {
    return {
        q: '*',
        facet: 'true',
        'facet.field': [],
        fq: [],
        legacy: {},
        fl: [],
        start: 0,
        rows: 10
    };
};
exports.createEmptySolrQuery = createEmptySolrQuery;
//////////////////////////////////////
// Solang Slice
//////////////////////////////////////
var initialState = {
    config: {},
    apps: {}
};
exports.SolangSlice = toolkit_1.createSlice({
    name: 'solang',
    initialState: initialState,
    reducers: {
        //////////////////////////////////////
        // Application reducers
        //////////////////////////////////////
        /**
         * Create a solr application
         * @param state
         * @param action
         */
        createApp: function (state, action) {
            if (!state.apps[action.payload.id]) {
                state.apps[action.payload.id] = __assign(__assign({}, action.payload), { query: exports.createEmptySolrQuery() });
            }
            else {
                throw Error("Solang app " + action.payload.id + " already exists!");
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
        setParams: function (state, action) {
            var _a;
            var appId = action.payload.appId;
            var app = state.apps[appId];
            app.params = action.payload.params;
            if ((_a = app === null || app === void 0 ? void 0 : app.config) === null || _a === void 0 ? void 0 : _a.setQuery) {
                app.config.setQuery(app.params, 'push');
            }
        },
        /**
         * Update a single parameter in an application
         * @param state
         * @param action
         */
        setParam: function (state, action) {
            var _a;
            var appId = action.payload.appId;
            var app = state.apps[appId];
            app.params[action.payload.key] = action.payload.value;
            if ((_a = app === null || app === void 0 ? void 0 : app.config) === null || _a === void 0 ? void 0 : _a.setQuery) {
                app.config.setQuery(app.params);
            }
        },
        /**
         * Usually triggered after params have been changed. Resets an application query. buildQueryEpic will execute
         * filter process functions to build the query before updating via sendQuery.
         * @param state
         * @param action
         */
        buildQuery: function (state, action) {
            console.log('buildQuery reducer', action);
            console.log('Setting URL params');
            var app = exports.getAppFromState(state, action.payload.appId);
            app.lastQuery = app.query || {};
            app.query = exports.createEmptySolrQuery();
        },
        /**
         * Stores a query. sendQueryEpic will then initiate the solr request and store result in resultsReceived
         * @param state
         * @param action
         */
        sendQuery: function (state, action) {
            console.log('sendQuery reducer', action);
        },
        /**
         * Updates results from a solr query to the application state
         * @param state
         * @param action
         */
        resultsReceived: function (state, action) {
            console.log('resultsReceived', action);
            var app = state.apps[action.payload.appId];
            app.response = action.payload.response.response;
        },
        /**
         * Triggers a
         * @param state
         */
        refreshResults: function (state, action) {
            console.log('refreshingData');
        },
        //////////////////////////////////////
        // Filter reducers
        //////////////////////////////////////
        /**
         * processQueryFacet reducer.
         * @param state
         * @param action
         */
        processFacetFilter: function (state, action) {
            var app = exports.getAppFromState(state, action.payload.appId);
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
        processSimpleFilter: function (state, action) {
            var app = exports.getAppFromState(state, action.payload.appId);
            if (app) {
                SimpleFilter_1.simpleFilterProcessParams(app.filters[action.payload.filter], app.params);
                SimpleFilter_1.simpleFilterProcessQuery(app.filters[action.payload.filter], app.query || exports.createEmptySolrQuery());
            }
        },
        /**
         * processPager reducer
         * @param state
         * @param action
         */
        processPager: function (state, action) {
            var app = exports.getAppFromState(state, action.payload.appId);
            SimplePager_1.simplePagerProcessParams(app, action.payload.filter, app.params);
            SimplePager_1.simplePagerProcessQuery(app.filters[action.payload.filter], app.query || exports.createEmptySolrQuery());
        },
        processSort: function (state, action) {
            var app = exports.getAppFromState(state, action.payload.appId);
            Sort_1.sortProcessParams(app, action.payload.filter, app.params);
            Sort_1.sortProcessQuery(app.filters[action.payload.filter], app.query || exports.createEmptySolrQuery());
        },
        /**
         * processCustomSearch reducer
         * @param state
         * @param action
         */
        processCustomFilter: function (state, action) {
            var app = exports.getAppFromState(state, action.payload.appId);
            if (app) {
                CustomFilter_1.customFilterProcessParams(app, action.payload.filter, app.params);
                CustomFilter_1.customFilterProcessQuery(app.filters[action.payload.filter], app.query || exports.createEmptySolrQuery());
            }
        }
    }
});
exports.createApp = (_a = exports.SolangSlice.actions, _a.createApp), exports.setParam = _a.setParam, exports.setParams = _a.setParams, exports.buildQuery = _a.buildQuery, exports.sendQuery = _a.sendQuery, exports.refreshResults = _a.refreshResults, exports.resultsReceived = _a.resultsReceived, exports.processFacetFilter = _a.processFacetFilter, exports.processSimpleFilter = _a.processSimpleFilter, exports.processCustomFilter = _a.processCustomFilter, exports.processPager = _a.processPager, exports.processSort = _a.processSort;
exports.SolangReducer = exports.SolangSlice.reducer;
