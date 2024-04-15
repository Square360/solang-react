import { PayloadAction } from '@reduxjs/toolkit';
import { ISolangApp, ISolangParamList, SolangState, ISolrQuery, ISolrResponse, ISolangAppConfig } from "../solang.types";
import { IFilterState } from "../filters/filter";
/**
 * Returns a reference to the app with the given appId in the given state, throwing an error if none found.
 * @param state
 * @param appId
 */
export declare const getAppFromState: (state: SolangState, appId: string) => ISolangApp;
/**
 * Returns a filter state from the solr slice
 * @param state
 * @param appId
 * @param filterAlias
 */
export declare const getFilterFromState: (state: SolangState, appId: string, filterAlias: string) => IFilterState;
export declare const getFilterFromApp: (app: ISolangApp, filterAlias: string) => IFilterState;
export declare const createEmptySolrQuery: () => ISolrQuery;
export interface ISolangState {
    solang: SolangState;
}
/**
 * Detects if the pager must be reset.
 * Any change to the param list not accompanied be a change in page should reset the pager to 0.
 * @param alias
 * @param existingParams
 * @param submittedParams
 */
export declare const pagerReset: (alias: string, existingParams: ISolangParamList, submittedParams: ISolangParamList) => ISolangParamList;
/**
 * Interfaces
 */
export interface ICreateAppPayload {
    id: string;
    endpoint: string;
    config: ISolangAppConfig;
    params: ISolangParamList;
    filters: {
        [key: string]: IFilterState;
    };
}
export interface ISetParamsPayload {
    appId: string;
    params: ISolangParamList;
}
export interface ISetParamPayload {
    appId: string;
    key: string;
    value: string | string[];
}
export interface IBuildQueryPayload {
    appId: string;
    query: ISolrQuery;
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
export interface iRefreshResultsPayload {
    appId: string;
}
export declare const SolangSlice: import("@reduxjs/toolkit").Slice<SolangState, {
    /**
     * Create a solr application
     * @param state
     * @param action
     */
    createApp: (state: SolangState, action: PayloadAction<ICreateAppPayload>) => void;
    /**
     * Set an application's parameters (eg when a user selects a search option)
     * @param state
     * @param action
     */
    setParams: (state: SolangState, action: PayloadAction<ISetParamsPayload>) => void;
    /**
     * Update a single parameter in an application
     * @param state
     * @param action
     */
    setParam: (state: SolangState, action: PayloadAction<ISetParamPayload>) => void;
    /**
     * Usually triggered after params have been changed. Resets an application query. buildQueryEpic will execute
     * filter process functions to build the query before updating via sendQuery.
     * @param state
     * @param action
     */
    buildQuery: (state: SolangState, action: PayloadAction<IBuildQueryPayload>) => void;
    /**
     * Stores a query. sendQueryEpic will then initiate the solr request and store result in resultsReceived
     * @param state
     * @param action
     */
    sendQuery: (state: SolangState, action: PayloadAction<iSendQueryPayload>) => void;
    /**
     * Updates results from a solr query to the application state
     * @param state
     * @param action
     */
    resultsReceived: (state: SolangState, action: PayloadAction<any>) => void;
    /**
     * Triggers a
     * @param state
     */
    refreshResults: (state: SolangState, action: PayloadAction<iRefreshResultsPayload>) => void;
    /**
     * processQueryFacet reducer.
     * @param state
     * @param action
     */
    processFacetFilter: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => void;
    /**
     * processSimpleFilter reducer
     * @param state
     * @param action
     */
    processSimpleFilter: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => void;
    /**
     * processPager reducer
     * @param state
     * @param action
     */
    processPager: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => void;
    processSort: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => void;
    processOptionsList: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => void;
    /**
     * processCustomSearch reducer
     * @param state
     * @param action
     */
    processCustomFilter: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => void;
    /**
     * processDateRange reducer
     * @param state
     * @param action
     */
    processDateRangeFilter: (state: SolangState, action: PayloadAction<IProcessFilterPayload>) => void;
}, "solang">;
export declare const createApp: import("@reduxjs/toolkit").ActionCreatorWithPayload<ICreateAppPayload, "solang/createApp">, setParam: import("@reduxjs/toolkit").ActionCreatorWithPayload<ISetParamPayload, "solang/setParam">, setParams: import("@reduxjs/toolkit").ActionCreatorWithPayload<ISetParamsPayload, "solang/setParams">, buildQuery: import("@reduxjs/toolkit").ActionCreatorWithPayload<IBuildQueryPayload, "solang/buildQuery">, sendQuery: import("@reduxjs/toolkit").ActionCreatorWithPayload<iSendQueryPayload, "solang/sendQuery">, refreshResults: import("@reduxjs/toolkit").ActionCreatorWithPayload<iRefreshResultsPayload, "solang/refreshResults">, resultsReceived: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "solang/resultsReceived">, processFacetFilter: import("@reduxjs/toolkit").ActionCreatorWithPayload<IProcessFilterPayload, "solang/processFacetFilter">, processSimpleFilter: import("@reduxjs/toolkit").ActionCreatorWithPayload<IProcessFilterPayload, "solang/processSimpleFilter">, processCustomFilter: import("@reduxjs/toolkit").ActionCreatorWithPayload<IProcessFilterPayload, "solang/processCustomFilter">, processPager: import("@reduxjs/toolkit").ActionCreatorWithPayload<IProcessFilterPayload, "solang/processPager">, processSort: import("@reduxjs/toolkit").ActionCreatorWithPayload<IProcessFilterPayload, "solang/processSort">, processOptionsList: import("@reduxjs/toolkit").ActionCreatorWithPayload<IProcessFilterPayload, "solang/processOptionsList">, processDateRangeFilter: import("@reduxjs/toolkit").ActionCreatorWithPayload<IProcessFilterPayload, "solang/processDateRangeFilter">;
export declare const SolangReducer: import("redux").Reducer<SolangState, import("redux").AnyAction>;
