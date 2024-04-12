import { IFacetFilterState, IFormattedFacetOption } from "../../filters/FacetFilter";
interface MyProps {
    appId: string;
    filterState: IFacetFilterState;
    facetCounts: IFormattedFacetOption[];
}
/**
 * Provides Checkbox facet filter
 * @param appId
 * @param filterState
 * @param facetCounts
 * @constructor
 */
declare const FacetCheckbox: ({ appId, filterState, facetCounts }: MyProps) => JSX.Element;
export default FacetCheckbox;
