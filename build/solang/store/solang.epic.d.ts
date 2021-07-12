/**
 * processParamsEpic executes after any actions which change a solr app's parameters.
 * This triggers the buildQuery action which in turn triggers the buildQueryEpic.
 * @param action$
 */
export declare const processParamsEpic: (action$: any) => any;
/**
 *
 * @param action$
 * @param state$
 */
export declare const processQueryEpic: (action$: any, state$: any) => any;
/**
 * sendQueryEpic fires when the solr query has been changed by sendQuery. Any new (sendQuery) action occurring before
 * the current query completes will cancel the current query.
 * @param action$
 * @param state$
 */
export declare const sendQueryEpic: (action$: any, state$: any) => any;
export declare const SolangEpic: import("redux-observable").Epic<import("redux").Action<any>, import("redux").Action<any>, void, any>;
