import { ISolangApp, ISolrQuery } from "./solang.types";
/**
 * Creates a solr query observable from the applications query object.
 * @param app
 */
export declare const createSolrQueryObs: (app: ISolangApp) => import("rxjs/dist/types/internal/Observable").Observable<import("rxjs/dist/types/ajax").AjaxResponse<unknown>>;
/**
 * Prepare solr query object parameters.
 * @param query
 */
export declare const prepareQuery: (query: ISolrQuery) => any;
