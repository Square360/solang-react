import { ajax } from 'rxjs/ajax';
export const createSolrQueryObs = function (app) {
    var _a, _b;
    const query = Object.assign({}, app.query);
    let params = prepareQuery(query);
    if ((_a = app.config) === null || _a === void 0 ? void 0 : _a.preprocessQuery) {
        params = (_b = app.config) === null || _b === void 0 ? void 0 : _b.preprocessQuery(params);
    }
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(arrayValue => urlParams.append(key, arrayValue));
        }
        else {
            urlParams.append(key, value);
        }
    });
    const queryUrl = `${app.endpoint}?${urlParams.toString()}`;
    const ajax$ = ajax({
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
        },
        url: queryUrl,
        method: 'GET',
    });
    return ajax$;
};
export const prepareQuery = function (query) {
    const params = Object.assign({}, query);
    if (params.filter === {}) {
        delete params.filter;
    }
    if (!params.q)
        params.q = '*';
    // Prepare json.facet
    if (params['json.facet'] && typeof params['json.facet'] === 'object') {
        const json = JSON.stringify(params['json.facet']);
        params['json.facet'] = json;
    }
    if (params.legacy) {
        Object.keys(params.legacy).forEach(key => {
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
//# sourceMappingURL=solang.api.js.map