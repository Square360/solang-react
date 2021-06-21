import { SolangApp, SolrQuery } from "./solang.types";

import { ajax } from 'rxjs/ajax';



export const createSolrQueryObs = function(app: SolangApp) {

  const query: SolrQuery = {...app.query};

  prepareQuery(query);

  const urlParams = new URLSearchParams(query as any);

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

export const prepareQuery = function(params: SolrQuery) {

  if (!params.q) params.q = '*';

  // Give us nested list json
  params.wt = 'json';
  // Prepare json.facet
  if (params['json.facet'] && typeof params['json.facet'] === 'object') {
    const json = JSON.stringify(params['json.facet']);
    params['json.facet'] = json;
  }
  /**
   * json.nl=arrmap will format as [{"facetValue1": facetCount1}, {"facetValue2": facetCount2}].
   * json.nl=map will format as {"facetValue1": facetCount1, "facetValue2": facetCount2}
   * @type {string}
   */
  params['json.nl'] = 'map';
}
