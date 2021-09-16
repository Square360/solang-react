"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.prepareQuery = exports.createSolrQueryObs = void 0;
var ajax_1 = require("rxjs/ajax");
var createSolrQueryObs = function (app) {
    var query = __assign({}, app.query);
    var params = exports.prepareQuery(query);
    var urlParams = new URLSearchParams();
    Object.entries(params).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (Array.isArray(value)) {
            value.forEach(function (arrayValue) { return urlParams.append(key, arrayValue); });
        }
        else {
            urlParams.append(key, value);
        }
    });
    var queryUrl = app.endpoint + "select?" + urlParams.toString();
    var ajax$ = ajax_1.ajax({
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json'
        },
        url: queryUrl,
        method: 'GET'
    });
    return ajax$;
};
exports.createSolrQueryObs = createSolrQueryObs;
var prepareQuery = function (query) {
    var params = __assign({}, query);
    if (!params.q)
        params.q = '*';
    // Give us nested list json
    params.wt = 'json';
    // Prepare json.facet
    if (params['json.facet'] && typeof params['json.facet'] === 'object') {
        var json = JSON.stringify(params['json.facet']);
        params['json.facet'] = json;
    }
    if (params.legacy) {
        Object.keys(params.legacy).forEach(function (key) {
            params[key] = params.legacy[key];
        });
        delete params.legacy;
    }
    /**
     * json.nl=arrmap will format as [{"facetValue1": facetCount1}, {"facetValue2": facetCount2}].
     * json.nl=map will format as {"facetValue1": facetCount1, "facetValue2": facetCount2}
     * @type {string}
     */
    params['json.nl'] = 'map';
    return params;
};
exports.prepareQuery = prepareQuery;
