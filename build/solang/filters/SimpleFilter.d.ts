import { ISolangParamList, ISolrQuery } from "../solang.types";
import { IFacetFilterState } from "./FacetFilter";
export declare function simpleFilterProcessParams(filterState: IFacetFilterState, params: ISolangParamList): void;
export declare function simpleFilterProcessQuery(filterState: IFacetFilterState, query: ISolrQuery): void;
