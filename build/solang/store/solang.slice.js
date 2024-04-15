import { createSlice } from '@reduxjs/toolkit';
import { facetFilterProcessParams, facetFilterProcessQuery } from "../filters/FacetFilter";
import { simpleFilterProcessParams, simpleFilterProcessQuery } from "../filters/SimpleFilter";
import { simplePagerProcessParams, simplePagerProcessQuery } from "../filters/SimplePager";
import { sortProcessParams, sortProcessQuery } from "../filters/Sort";
import { customFilterProcessParams, customFilterProcessQuery } from "../filters/CustomFilter";
import logger from "../logger";
import { optionsListProcessParams } from "../filters/OptionsList";
import { dateRangeFilterProcessParams, dateRangeFilterProcessQuery } from "../filters/DateRangeFilter";
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
        logger(`App ${appId} doesn't exist!`);
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
    const app = getAppFromState(state, appId);
    return getFilterFromApp(app, filterAlias);
};
export const getFilterFromApp = (app, filterAlias) => {
    var _a;
    const filter = (_a = app.filters[filterAlias]) !== null && _a !== void 0 ? _a : null;
    if (!filter) {
        logger(`Filter ${filterAlias} on app ${app.id} doesn't exist!`);
    }
    return filter;
};
export const createEmptySolrQuery = () => {
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
/**
 * Detects if the pager must be reset.
 * Any change to the param list not accompanied be a change in page should reset the pager to 0.
 * @param alias
 * @param existingParams
 * @param submittedParams
 */
export const pagerReset = (alias, existingParams, submittedParams) => {
    if (alias && alias !== "") {
        const filteredExistingParams = Object.fromEntries(Object.entries(existingParams).filter(([key, value]) => key !== alias));
        const filteredSubmittedParams = Object.fromEntries(Object.entries(submittedParams).filter(([key, value]) => key !== alias));
        if (JSON.stringify(filteredExistingParams) !== JSON.stringify(filteredSubmittedParams)) {
            submittedParams[alias] = '0';
        }
    }
    return submittedParams;
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
            var _a;
            const appId = action.payload.appId;
            const app = state.apps[appId];
            if ("pagerReset" in app.config) {
                const processedParams = pagerReset(app.config.pagerReset, app.params, action.payload.params);
                app.params = processedParams;
            }
            else {
                app.params = action.payload.params;
            }
            if ((_a = app === null || app === void 0 ? void 0 : app.config) === null || _a === void 0 ? void 0 : _a.setQuery) {
                app.config.setQuery(app.params, 'push');
            }
        },
        /**
         * Update a single parameter in an application
         * @param state
         * @param action
         */
        setParam: (state, action) => {
            var _a;
            const appId = action.payload.appId;
            const app = state.apps[appId];
            const newParams = Object.assign({}, app.params);
            newParams[action.payload.key] = action.payload.value;
            if ("pagerReset" in app.config) {
                const processedParams = pagerReset(app.config.pagerReset, app.params, newParams);
                app.params = processedParams;
            }
            else {
                app.params = newParams;
            }
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
        buildQuery: (state, action) => {
            logger('buildQuery reducer', action);
            logger('Setting URL params');
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
            logger('sendQuery reducer', action);
        },
        /**
         * Updates results from a solr query to the application state
         * @param state
         * @param action
         */
        resultsReceived: (state, action) => {
            logger('resultsReceived', action);
            const app = state.apps[action.payload.appId];
            app.response = action.payload.response.response;
        },
        /**
         * Triggers a
         * @param state
         */
        refreshResults: (state, action) => {
            logger('refreshingData');
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
        },
        /**
         * processPager reducer
         * @param state
         * @param action
         */
        processPager: (state, action) => {
            let app = getAppFromState(state, action.payload.appId);
            simplePagerProcessParams(app, action.payload.filter, app.params);
            simplePagerProcessQuery(app.filters[action.payload.filter], app.query || createEmptySolrQuery());
        },
        processSort: (state, action) => {
            let app = getAppFromState(state, action.payload.appId);
            sortProcessParams(app, action.payload.filter, app.params);
            sortProcessQuery(app.filters[action.payload.filter], app.query || createEmptySolrQuery());
        },
        processOptionsList: (state, action) => {
            let app = getAppFromState(state, action.payload.appId);
            optionsListProcessParams(app, action.payload.filter, app.params);
        },
        /**
         * processCustomSearch reducer
         * @param state
         * @param action
         */
        processCustomFilter: (state, action) => {
            let app = getAppFromState(state, action.payload.appId);
            customFilterProcessParams(app, action.payload.filter, app.params);
            customFilterProcessQuery(app.filters[action.payload.filter], app.query || createEmptySolrQuery());
        },
        /**
         * processDateRange reducer
         * @param state
         * @param action
         */
        processDateRangeFilter: (state, action) => {
            let app = getAppFromState(state, action.payload.appId);
            dateRangeFilterProcessParams(app, action.payload.filter, app.params);
            dateRangeFilterProcessQuery(app.filters[action.payload.filter], app.query || createEmptySolrQuery());
        },
    }
});
export const { createApp, setParam, setParams, buildQuery, sendQuery, refreshResults, resultsReceived, processFacetFilter, processSimpleFilter, processCustomFilter, processPager, processSort, processOptionsList, processDateRangeFilter } = SolangSlice.actions;
export const SolangReducer = SolangSlice.reducer;
//# sourceMappingURL=solang.slice.js.map