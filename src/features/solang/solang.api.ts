import { SolangApp, SolrQuery } from "./solang.types";

import { ajax } from 'rxjs/ajax';



export const createSolrQueryObs = function(app: SolangApp) {

  const query: SolrQuery = {...app.query};

  const params = prepareQuery(query);

  const urlParams = new URLSearchParams(params as any);

  const queryUrl = `${app.endpoint}select?${urlParams.toString()}`

  const ajax$ = ajax({
    url: queryUrl,
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
  });

  return ajax$;
}

export const prepareQuery = function(query: SolrQuery) {

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
