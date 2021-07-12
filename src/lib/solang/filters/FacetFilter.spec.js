import { facetFilterGetCountsFromState } from "./FacetFilter";
import { createEmptySolrQuery } from "../store/solang.slice";
describe('facetFilterGetCountsFromState', () => {

  const APP_ID = 'test_app';
  const F_ALIAS = 'f_alias';
  const F_FIELD = 'f_field';

  const createInitState = () => {
    return {
      config: {},
      apps: {
        [APP_ID]: {
          id: APP_ID,
          query: createEmptySolrQuery(),
          endpoint: 'http://localhost:8983/solr/solang/',
          params: {},
          filters: {
            [F_ALIAS]: {
              id: F_ALIAS,
              config: {
                solrField: F_FIELD,
                alias: F_ALIAS,
              },
              processQueryActions: [],
              value: []
            }
          },
          response : {
            responseHeader: {},
            response: {
              numFound: 0,
              start: 0,
              docs: []
            },
            facet_counts: {
              facet_fields: {},
              facet_queries: {},
              facet_ranges: {},
              facet_intervals: {},
              facet_heatmaps: {}
            }
          }
        }
      }
    }
  }


  it('should default to empty array', () => {
    let state = createInitState();
    expect( facetFilterGetCountsFromState(state, APP_ID, F_ALIAS) ).toEqual([
    ]);
  });



  it('should extract correctly formatted options', () => {
    let state = createInitState();
    // @ts-ignore
    state.apps[APP_ID].response.facet_counts.facet_fields[F_FIELD] = {
      beta: 2,
      gamma: 7,
      delta: 4,
    };
    expect( facetFilterGetCountsFromState(state, APP_ID, F_ALIAS) ).toEqual([
      { value: 'beta', count: 2},
      { value: 'delta', count: 4},
      { value: 'gamma', count: 7},
    ]);
  });

  it('should sort by value', () => {
    let state = createInitState();
    // Set to sort alpha
    state.apps[APP_ID].filters[F_ALIAS].config.sortAlpha = true;
    // @ts-ignore
    state.apps[APP_ID].response.facet_counts.facet_fields[F_FIELD] = {
      beta: 2,
      gamma: 7,
      delta: 4,
    };
    expect( facetFilterGetCountsFromState(state, APP_ID, F_ALIAS) ).toEqual([
      { value: 'beta', count: 2},
      { value: 'delta', count: 4},
      { value: 'gamma', count: 7},
    ]);

  });
  it('should sort by count', () => {
    let state = createInitState();
    // Set to sort alpha
    state.apps[APP_ID].filters[F_ALIAS].config.sortAlpha = false;
    // @ts-ignore
    state.apps[APP_ID].response.facet_counts.facet_fields[F_FIELD] = {
      beta: 2,
      gamma: 7,
      delta: 4,
    };
    expect( facetFilterGetCountsFromState(state, APP_ID, F_ALIAS) ).toEqual([
      { value: 'beta', count: 2},
      { value: 'delta', count: 4},
      { value: 'gamma', count: 7},
    ]);  });

  it('should include preselected values', () => {

    let state = createInitState();

    state.apps[APP_ID].filters[F_ALIAS].value = [
      'epsilon'
    ];

    // @ts-ignore
    state.apps[APP_ID].response.facet_counts.facet_fields[F_FIELD] = {
      beta: 2,
      gamma: 7,
      delta: 4,
    };
    expect( facetFilterGetCountsFromState(state, APP_ID, F_ALIAS) ).toEqual([
      { value: 'epsilon', count: 0},
      { value: 'beta', count: 2},
      { value: 'delta', count: 4},
      { value: 'gamma', count: 7},
    ]);
  });


});
