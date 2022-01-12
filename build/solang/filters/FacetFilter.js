import { filterProcessParams } from "./filter";
import { getAppFromState, getFilterFromApp } from "../store/solang.slice";
;
export const facetFilterProcessParams = function (filterState, params) {
    filterProcessParams(filterState, params);
};
export const facetFilterProcessQuery = function (filterState, query) {
    facetFilterAddFacetField(filterState.config, query);
    facetFilterAddQuery(filterState, query);
};
/**
 * Given a filter config & solr query, add the arguments which will request facet options
 * @param query
 */
export function facetFilterAddFacetField(config, query) {
    if (config.excludeTag === true) {
        query['facet.field'].push(`{!ex=${config.alias}}${config.solrField}`);
    }
    else {
        query['facet.field'].push(`${config.solrField}`);
    }
    if (config.sortAlpha) {
        query.legacy[`f.${config.solrField}.facet.sort`] = 'index';
    }
    if (config.missingLabel) {
        query.legacy[`f.${config.solrField}.facet.missing`] = 'true';
    }
    if (config.limit) {
        query.legacy[`f.${config.solrField}.facet.limit`] = config.limit.toString();
    }
    if (config.minCount) {
        query.legacy[`f.${config.solrField}.facet.mincount`] = (config.minCount === undefined) ? '1' : config.minCount.toString();
    }
}
export function facetFilterAddQuery(filterState, query) {
    if (filterState.value.length > 0) {
        const join = (filterState.config.isOr === true) ? ' OR ' : ' ';
        const options = filterState.value.map(option => facetFilterProcessOption(filterState.config, option)).join(join);
        query.fq.push(`{!tag='${filterState.config.alias}'}${options}`);
    }
}
/**
 * Processes an option value before adding to query (converts to empty if required)
 * @param option
 */
function facetFilterProcessOption(config, option) {
    if (config.missingLabel && option === config.missingLabel) {
        return facetFilterGetMissingFragment(config);
    }
    return `(${config.solrField}:"${option}")`;
}
/**
 * Returns the equivalent filter fragment for selecting items without a value.
 */
function facetFilterGetMissingFragment(config) {
    return `(*:* NOT ${config.solrField}:*)`;
}
;
/**
 * Returns possible facet options for the given filter.
 * @param state
 * @param appId
 * @param filterAlias
 */
export const facetFilterGetCountsFromState = (state, appId, filterAlias) => {
    const app = getAppFromState(state, appId);
    return facetFilterGetCountsFromAppState(app, filterAlias);
};
export const facetFilterGetCountsFromAppState = (app, filterAlias) => {
    const filter = getFilterFromApp(app, filterAlias);
    let facetOptions = {};
    // Add pre-selected values into array
    filter.value.forEach((value) => {
        facetOptions[value] = 0;
    });
    // Add returned facet options into array
    if (app.response && app.response.facet_counts) {
        const solrField = filter.config.solrField;
        if (app.response.facet_counts.facet_fields[solrField]) {
            const counts = app.response.facet_counts.facet_fields[solrField];
            Object.keys(app.response.facet_counts.facet_fields[solrField]).forEach((value) => {
                facetOptions[value] = counts[value];
            });
        }
    }
    const formattedFacetOptions = Object.keys(facetOptions).map((value) => {
        return { value: value, count: facetOptions[value] };
    });
    const sortedFacetOptions = formattedFacetOptions.sort((a, b) => {
        if (filter.config.sortAlpha) {
            if (a.value < b.value)
                return -1;
            else if (a.value > b.value)
                return 1;
            else
                return 0;
        }
        else {
            if (a.count < b.count)
                return -1;
            else if (a.count > b.count)
                return 1;
            else
                return 0;
        }
    });
    return sortedFacetOptions;
};
//# sourceMappingURL=FacetFilter.js.map