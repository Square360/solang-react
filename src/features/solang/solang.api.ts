import { ISolangApp, ISolrQuery } from "./solang.types";

import { ajax } from 'rxjs/ajax';

export const createSolrQueryObs = function(app: ISolangApp) {

  const query: ISolrQuery = {...app.query};

  const params = prepareQuery(query);

  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(arrayValue => urlParams.append(key, arrayValue))
    }
    else {
      urlParams.append(key, value as string);
    }
  });

  const queryUrl = `${app.endpoint}select?${urlParams.toString()}`

  const ajax$ = ajax({
    crossDomain: true,
    headers: {
      'Content-Type': 'application/json',
    },
    url: queryUrl,
    method: 'GET',
  });

  return ajax$;
}

export const prepareQuery = function(query: ISolrQuery) {

  const params: any = {...query};

  if (!params.q) params.q = '*';

  // Give us nested list json
  params.wt = 'json';
  // Prepare json.facet
  if (params['json.facet'] && typeof params['json.facet'] === 'object') {
    const json = JSON.stringify(params['json.facet']);
    params['json.facet'] = json;
  }

  if (params.legacy) {
    Object.keys(params.legacy).forEach( key => {
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
}
