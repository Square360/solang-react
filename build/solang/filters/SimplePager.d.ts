import { ISolangApp, ISolangParamList, ISolrQuery, SolangState } from "../solang.types";
import { IFilterState } from "./filter";
export interface ISimplePagerConfig {
    rows: number;
}
export interface ISimplePagerState extends IFilterState {
    config: ISimplePagerConfig;
    value: number;
}
export declare function simplePagerProcessParams(app: ISolangApp, filterId: string, params: ISolangParamList): void;
export declare function simplePagerProcessQuery(filterState: ISimplePagerState, query: ISolrQuery): void;
export declare function getCountFromResponse(state: SolangState, appId: string): number;
