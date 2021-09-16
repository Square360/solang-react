"use strict";
exports.__esModule = true;
exports.facetFilterGetCountsFromAppState = exports.facetFilterGetCountsFromState = exports.facetFilterAddQuery = exports.facetFilterAddFacetField = exports.facetFilterProcessQuery = exports.facetFilterProcessParams = void 0;
var filter_1 = require("./filter");
var solang_slice_1 = require("../store/solang.slice");
;
var facetFilterProcessParams = function (filterState, params) {
    filter_1.filterProcessParams(filterState, params);
};
exports.facetFilterProcessParams = facetFilterProcessParams;
var facetFilterProcessQuery = function (filterState, query) {
    facetFilterAddFacetField(filterState.config, query);
    facetFilterAddQuery(filterState, query);
};
exports.facetFilterProcessQuery = facetFilterProcessQuery;
/**
 * Given a filter config & solr query, add the arguments which will request facet options
 * @param query
 */
function facetFilterAddFacetField(config, query) {
    if (config.excludeTag === true) {
        query['facet.field'].push("{!ex=" + config.alias + "}" + config.solrField);
    }
    else {
        query['facet.field'].push("" + config.solrField);
    }
    if (config.sortAlpha) {
        query.legacy["f." + config.solrField + ".facet.sort"] = 'index';
    }
    if (config.missingLabel) {
        query.legacy["f." + config.solrField + ".facet.missing"] = 'true';
    }
    if (config.limit) {
        query.legacy["f." + config.solrField + ".facet.limit"] = config.limit.toString();
    }
    if (config.minCount) {
        query.legacy["f." + config.solrField + ".facet.mincount"] = (config.minCount === undefined) ? '1' : config.minCount.toString();
    }
}
exports.facetFilterAddFacetField = facetFilterAddFacetField;
function facetFilterAddQuery(filterState, query) {
    if (filterState.value.length > 0) {
        var join = (filterState.config.isOr === true) ? ' OR ' : ' ';
        var options = filterState.value.map(function (option) { return facetFilterProcessOption(filterState.config, option); }).join(join);
        query.fq.push("{!tag='" + filterState.config.alias + "'}" + options);
    }
}
exports.facetFilterAddQuery = facetFilterAddQuery;
/**
 * Processes an option value before adding to query (converts to empty if required)
 * @param option
 */
function facetFilterProcessOption(config, option) {
    if (config.missingLabel && option === config.missingLabel) {
        return facetFilterGetMissingFragment(config);
    }
    return "(" + config.solrField + ":\"" + option + "\")";
}
/**
 * Returns the equivalent filter fragment for selecting items without a value.
 */
function facetFilterGetMissingFragment(config) {
    return "(*:* NOT " + config.solrField + ":*)";
}
;
/**
 * Returns possible facet options for the given filter.
 * @param state
 * @param appId
 * @param filterAlias
 */
var facetFilterGetCountsFromState = function (state, appId, filterAlias) {
    var app = solang_slice_1.getAppFromState(state, appId);
    return exports.facetFilterGetCountsFromAppState(app, filterAlias);
};
exports.facetFilterGetCountsFromState = facetFilterGetCountsFromState;
var facetFilterGetCountsFromAppState = function (app, filterAlias) {
    var filter = solang_slice_1.getFilterFromApp(app, filterAlias);
    var facetOptions = {};
    // Add pre-selected values into array
    filter.value.forEach(function (value) {
        facetOptions[value] = 0;
    });
    // Add returned facet options into array
    if (app.response && app.response.facet_counts) {
        var solrField = filter.config.solrField;
        if (app.response.facet_counts.facet_fields[solrField]) {
            var counts_1 = app.response.facet_counts.facet_fields[solrField];
            Object.keys(app.response.facet_counts.facet_fields[solrField]).forEach(function (value) {
                facetOptions[value] = counts_1[value];
            });
        }
    }
    var formattedFacetOptions = Object.keys(facetOptions).map(function (value) {
        return { value: value, count: facetOptions[value] };
    });
    var sortedFacetOptions = formattedFacetOptions.sort(function (a, b) {
        if (filter.config.sortAlpha) {
            if (a.value < b.value)
                return -1;
            else if (a.value < b.value)
                return 1;
            else
                return 0;
        }
        else {
            if (a.count < b.count)
                return -1;
            else if (a.count < b.count)
                return 1;
            else
                return 0;
        }
    });
    return sortedFacetOptions;
};
exports.facetFilterGetCountsFromAppState = facetFilterGetCountsFromAppState;
