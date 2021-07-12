import { IFacetFilterState } from "../../filters/FacetFilter";
import { ISolrFacetField } from "../../solang.types";
import './FacetCheckbox.scss';
interface MyProps {
    appId: string;
    filterState: IFacetFilterState;
    facetCounts: ISolrFacetField;
}
/**
 * Provides Checkbox facet filter
 * @param appId
 * @param filterState
 * @param facetCounts
 * @constructor
 */
declare const FacetCheckbox: ({ appId, filterState, facetCounts, }: MyProps) => JSX.Element;
export default FacetCheckbox;
