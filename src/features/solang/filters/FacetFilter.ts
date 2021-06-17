import { IFacetOption, IParamProcessor, IQueryProcessor } from "./filter";
import { SolangParamList, SolrQuery } from "../solang.types";


export interface IFacetFilterConfig {
  // solrField determines the field which will be filtered
  solrField: string;
  // alias is used both as the key for this filter's values in parameter lists and the tag in solr queries (which
  // gives us greater control over the query)
  alias: string;
  // Maps to the solr option {!ex=tagname} see: https://solr.apache.org/guide/7_0/faceting.html#tagging-and-excluding-filters
  excludeTag: boolean | string;
  // If false, will be sorted numerically by count (facet.sort)
  sortAlpha: boolean | string;
  // Limit the number of possible facets returned (facet.limit)
  limit: number;
  // Limit returned facets by the count (facet.mincount)
  minCount: number;
  // If true will combine multiple options using logical OR when filtering results
  isOr?: boolean;
  // If provided, an extra facet option will be created representing documents with NO VALUE for the field. The string
  // will be used as the label for the facet option. (facet.missing)
  missingLabel?: string;
};



export interface IFacetFilterState {
  // Filter config
  config: IFacetFilterConfig;
  // The currently selected options
  selected: string[];
  // The available facetOptions
  options: IFacetOption[];
  // Boolean indicating whether filter has a selected value - ToDo: do we need hasValue?
  hasValue: boolean
}

export const facetFilterProcessParams = function (filterState: IFacetFilterState, params: SolangParamList) {

  const alias = filterState.config.alias;
  let selected: string[];

  if ( Array.isArray(  params[ alias ] ) ) {
    selected = params[ alias ] as string[];
    filterState.hasValue = true;
  }
  else if ( params[ alias ] ) {
    selected = [ params[ alias ] ] as string[];
    filterState.hasValue = true;
  }
  else {
    selected = [];
    filterState.hasValue = false;
  }

  filterState.selected = selected;
}

export const facetFilterProcessQuery = function (filterState: IFacetFilterState, config: IFacetFilterConfig, query: SolrQuery) {
  facetFilterAddFacetField(config, query);
  facetFilterProcessQuery(filterState, config, query);
}

/**
 * Given a filter config & solr query, add the arguments which will request facet options
 * @param query
 */
export function facetFilterAddFacetField ( config: IFacetFilterConfig, query: SolrQuery ) {

  if ( config.excludeTag === true ) {
    query['facet.field'].push( `{!ex=${config.alias}}${config.solrField}` );
  }
  else {
    query['facet.field'].push( `${config.solrField}` );
  }

  if ( config.sortAlpha ) {
    query.legacy[`f.${config.solrField}.facet.sort`] = 'index';
  }

  if ( config.missingLabel ) {
    query.legacy[`f.${config.solrField}.facet.missing`] = 'true';
  }

  if ( config.limit ) {
    query.legacy[`f.${config.solrField}.facet.limit`] = config.limit.toString();
  }

  if ( config.minCount ) {
    query.legacy[`f.${config.solrField}.facet.mincount`] = (config.minCount === undefined) ? '1' : config.minCount.toString();
  }
}


export const facetFilterAddQuery = function (filterState: IFacetFilterState, config: IFacetFilterConfig, query: SolrQuery) {

  const join = (config.isOr === true) ? ' OR ' : ' ';

  const options = filterState.selected.map(
    option => facetFilterProcessOption(config, option)
  ).join(join);

  query.fq.push(`{!tag='${config.alias}'}${options}`);

}

/**
 * Processes an option value before adding to query (converts to empty if required)
 * @param option
 */
const facetFilterProcessOption = function (config: IFacetFilterConfig, option: string) {
  if ( config.missingLabel && option === config.missingLabel) {
    return facetFilterGetMissingFragment(config);
  }
  return `(${config.solrField}:"${option}")`;
}

/**
 * Returns the equivalent filter fragment for selecting items without a value.
 */
const facetFilterGetMissingFragment = function (config: IFacetFilterConfig) {
  return `(*:* NOT ${config.solrField}:*)`;
}

