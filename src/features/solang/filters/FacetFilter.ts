import { filterProcessParams, IFacetOption, IFilterState } from "./filter";
import { ISolangParamList, ISolrQuery } from "../solang.types";

export interface IFacetFilterConfig {
  // solrField determines the field which will be filtered
  solrField: string;
  // alias is used both as the key for this filter's values in parameter lists and the tag in solr queries (which
  // gives us greater control over the query)
  alias: string;
  // Maps to the solr option {!ex=tagname} see: https://solr.apache.org/guide/7_0/faceting.html#tagging-and-excluding-filters
  excludeTag: boolean;
  // If false, will be sorted numerically by count (facet.sort)
  sortAlpha: boolean;
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

export interface IFacetFilterState extends IFilterState {
  // Filter config
  config: IFacetFilterConfig;
  // The currently filter value
  value: string[];
  // The available facetOptions
  options: IFacetOption[];
  // Boolean indicating whether filter has a selected value - ToDo: do we need hasValue?
  hasValue: boolean
}

export const facetFilterProcessParams = function (filterState: IFacetFilterState, params: ISolangParamList) {
  filterProcessParams(filterState, params);
}

export const facetFilterProcessQuery = function (filterState: IFacetFilterState, query: ISolrQuery) {
  facetFilterAddFacetField(filterState.config, query);
  facetFilterAddQuery(filterState, query);
}

/**
 * Given a filter config & solr query, add the arguments which will request facet options
 * @param query
 */
export function facetFilterAddFacetField ( config: IFacetFilterConfig, query: ISolrQuery ) {

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


export function facetFilterAddQuery (filterState: IFacetFilterState, query: ISolrQuery) {

  if (filterState.value.length > 0) {
    const join = (filterState.config.isOr === true) ? ' OR ' : ' ';

    const options = filterState.value.map(
      option => facetFilterProcessOption(filterState.config, option)
    ).join(join);

    query.fq.push(`{!tag='${filterState.config.alias}'}${options}`);
  }

}

/**
 * Processes an option value before adding to query (converts to empty if required)
 * @param option
 */
function facetFilterProcessOption (config: IFacetFilterConfig, option: string) {
  if ( config.missingLabel && option === config.missingLabel) {
    return facetFilterGetMissingFragment(config);
  }
  return `(${config.solrField}:"${option}")`;
}


/**
 * Returns the equivalent filter fragment for selecting items without a value.
 */
function facetFilterGetMissingFragment (config: IFacetFilterConfig) {
  return `(*:* NOT ${config.solrField}:*)`;
}

