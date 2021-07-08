"use strict";

var _FacetFilter = require("./FacetFilter");

var _solang = require("../store/solang.slice");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

describe('facetFilterGetCountsFromState', function () {
  var APP_ID = 'test_app';
  var F_ALIAS = 'f_alias';
  var F_FIELD = 'f_field';

  var createInitState = function createInitState() {
    return {
      config: {},
      apps: _defineProperty({}, APP_ID, {
        id: APP_ID,
        query: (0, _solang.createEmptySolrQuery)(),
        endpoint: 'http://localhost:8983/solr/solang/',
        params: {},
        filters: _defineProperty({}, F_ALIAS, {
          id: F_ALIAS,
          config: {
            solrField: F_FIELD,
            alias: F_ALIAS
          },
          processQueryActions: [],
          value: []
        }),
        response: {
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
      })
    };
  };

  it('should default to empty array', function () {
    var state = createInitState();
    expect((0, _FacetFilter.facetFilterGetCountsFromState)(state, APP_ID, F_ALIAS)).toEqual([]);
  });
  it('should extract correctly formatted options', function () {
    var state = createInitState(); // @ts-ignore

    state.apps[APP_ID].response.facet_counts.facet_fields[F_FIELD] = {
      beta: 2,
      gamma: 7,
      delta: 4
    };
    expect((0, _FacetFilter.facetFilterGetCountsFromState)(state, APP_ID, F_ALIAS)).toEqual([{
      value: 'beta',
      count: 2
    }, {
      value: 'delta',
      count: 4
    }, {
      value: 'gamma',
      count: 7
    }]);
  });
  it('should sort by value', function () {
    var state = createInitState(); // Set to sort alpha

    state.apps[APP_ID].filters[F_ALIAS].config.sortAlpha = true; // @ts-ignore

    state.apps[APP_ID].response.facet_counts.facet_fields[F_FIELD] = {
      beta: 2,
      gamma: 7,
      delta: 4
    };
    expect((0, _FacetFilter.facetFilterGetCountsFromState)(state, APP_ID, F_ALIAS)).toEqual([{
      value: 'beta',
      count: 2
    }, {
      value: 'delta',
      count: 4
    }, {
      value: 'gamma',
      count: 7
    }]);
  });
  it('should sort by count', function () {
    var state = createInitState(); // Set to sort alpha

    state.apps[APP_ID].filters[F_ALIAS].config.sortAlpha = false; // @ts-ignore

    state.apps[APP_ID].response.facet_counts.facet_fields[F_FIELD] = {
      beta: 2,
      gamma: 7,
      delta: 4
    };
    expect((0, _FacetFilter.facetFilterGetCountsFromState)(state, APP_ID, F_ALIAS)).toEqual([{
      value: 'beta',
      count: 2
    }, {
      value: 'delta',
      count: 4
    }, {
      value: 'gamma',
      count: 7
    }]);
  });
  it('should include preselected values', function () {
    var state = createInitState();
    state.apps[APP_ID].filters[F_ALIAS].value = ['epsilon']; // @ts-ignore

    state.apps[APP_ID].response.facet_counts.facet_fields[F_FIELD] = {
      beta: 2,
      gamma: 7,
      delta: 4
    };
    expect((0, _FacetFilter.facetFilterGetCountsFromState)(state, APP_ID, F_ALIAS)).toEqual([{
      value: 'epsilon',
      count: 0
    }, {
      value: 'beta',
      count: 2
    }, {
      value: 'delta',
      count: 4
    }, {
      value: 'gamma',
      count: 7
    }]);
  });
});