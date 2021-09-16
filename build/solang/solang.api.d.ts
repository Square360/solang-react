import { ISolangApp, ISolrQuery } from "./solang.types";
export declare const createSolrQueryObs: (app: ISolangApp) => import("rxjs/dist/types/internal/Observable").Observable<import("rxjs/dist/types/ajax").AjaxResponse<unknown>>;
export declare const prepareQuery: (query: ISolrQuery) => any;
