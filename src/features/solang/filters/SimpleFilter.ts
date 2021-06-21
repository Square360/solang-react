import { SolangParamList, SolrQuery } from "../solang.types";
import { facetFilterAddFacetField, facetFilterAddQuery, IFacetFilterState } from "./FacetFilter";

export function simpleFilterProcessParams (filterState: IFacetFilterState, params: SolangParamList) {
  const alias = filterState.config.alias;

  if ( Array.isArray( params[ alias ] ) ) {
    filterState.value = params[ alias ] as string[];
    filterState.hasValue = true;
  }
  else if ( params[ alias ] ) {
    filterState.value = [ params[ alias ] as string ];
    filterState.hasValue = true;
  }
  else {
    filterState.value = [];
    filterState.hasValue = false;
  }
}

export function simpleFilterProcessQuery (filterState: IFacetFilterState, query: SolrQuery) {
  const solrField = filterState.config.solrField;
  const field = solrField === 'q' ? '' : `${solrField}:`
  query.q = filterState.hasValue ? `${field}${filterState.value[0]}*` : '*';
}
