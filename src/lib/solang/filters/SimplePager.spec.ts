import { ISimplePagerState, simplePagerProcessParams, simplePagerProcessQuery } from "./SimplePager";
import { createEmptySolrQuery } from "../store/solang.slice";
import { facetFilterGetCountsFromState } from "./FacetFilter";
import { ISolangParamList } from "../solang.types";
import { simpleFilterProcessQuery } from "./SimpleFilter";

describe('SimpleSearch', () => {

  const APP_ID = 'test_app';
  const F_ALIAS = 'f_alias';

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
                rows: 9,
                alias: F_ALIAS,
              },
              processQueryActions: [],
              value: []
            }
          },
          response: {
            responseHeader: {},
            response: {
              numFound: 0,
              start: 0,
              docs: []
            },
          }
        }
      }
    }
  }


  it('should extract page from parameters', () => {
    let state = createInitState();
    let app = state.apps[APP_ID];
    const params = {
      page: '9'
    }

    simplePagerProcessParams(app,  F_ALIAS, params);

    expect(app.filters[F_ALIAS].value).toEqual(9);
  });


  it('should extract page=1 by default', () => {
    let state = createInitState();
    let app = state.apps[APP_ID];
    const params = {}

    simplePagerProcessParams(app,  F_ALIAS, params);

    expect(app.filters[F_ALIAS].value).toEqual(0);
  });

  it('should correctly modify query', () => {
    let filterState: ISimplePagerState = {
      config: {
        rows: 9
      },
      value: 1,
      processQueryActions: []
    };
    let query = createEmptySolrQuery();
    simplePagerProcessQuery(filterState, query);
    expect([query.start, query.rows]).toEqual([9,9]);
  })
  it('should correctly modify query', () => {
    let filterState: ISimplePagerState = {
      config: {
        rows: 9
      },
      value: 1,
      processQueryActions: []
    };
    let query = createEmptySolrQuery();
    simplePagerProcessQuery(filterState, query);
    expect([query.start, query.rows]).toEqual([9,9]);
  });

});
// Should correctly modify query

// Get count from response

// Get count from response default to 0
