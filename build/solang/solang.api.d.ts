import { ISolangApp, ISolrQuery } from "./solang.types";
export declare const createSolrQueryObs: (app: ISolangApp) => import("rxjs").Observable<import("rxjs/ajax").AjaxResponse<unknown>>;
export declare const prepareQuery: (query: ISolrQuery) => any;
