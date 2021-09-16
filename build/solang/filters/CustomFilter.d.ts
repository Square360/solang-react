import { IFilterState } from "./filter";
import { ISolangApp, ISolangParamList, ISolrQuery } from "../solang.types";
export declare type iCustomFilterCallback = (value: string) => string;
export interface ICustomFilterState extends IFilterState {
    config: {
        alias: string;
        process: iCustomFilterCallback;
    };
}
export declare function customFilterProcessParams(app: ISolangApp, filterId: string, params: ISolangParamList): void;
export declare const customFilterProcessQuery: (filterState: ICustomFilterState, query: ISolrQuery) => void;
