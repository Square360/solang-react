import React from 'react';
import './App.scss';
import { useAppSelector, useAppDispatch } from "./store/hooks";
import {RootState} from "./store/store";
import {
  getAppFromState,
  createApp,
  processFacetFilter,
  processPager,
  processSimpleFilter,
  processSort, refreshResults, processCustomFilter,
} from "../lib/solang/store/solang.slice";
import { TestSolang } from "./components/TestSolang/TestSolang";
import {ArrayParam, StringParam, useQueryParams, withDefault} from "use-query-params";
import {ISolrQuery} from "../lib/solang/solang.types";

function App() {

  const dispatch = useAppDispatch();
  const searchApp = useAppSelector((state: RootState) => getAppFromState(state.solang, 'searchApp') );

  // Setup listener for query params on route
  const [queryParams, setQuery] = useQueryParams({
    searchText: withDefault(StringParam, 'Dav'),
    country: withDefault(ArrayParam, []),
    city: withDefault(ArrayParam, []),
    page: withDefault(StringParam, '0'),
    sort: withDefault(StringParam, ''),
  });

  const preprocessQuery = (query: ISolrQuery) => {
    const newQuery = {...query};
    newQuery.s = query.q;
    delete newQuery.q;
    return newQuery;
  }

  if (!searchApp) {
    const searchFilters = {
      searchText: {
        config: {
          process: (value: string) => (!value || value === '') ? '*:*' : `label:(${value}) OR (${value}*)`,
          alias: 'searchText',
        },
        processQueryActions: [processCustomFilter.type],
        value: queryParams.searchText || ''
      },
      country: { // type: facet filter
        config: {
          solrField: 'country_s',
          alias: 'country',
          label: 'Country',
          minCount: 1,
          sortAlpha: true,
          excludeTag: true
        },
        processQueryActions: [
          processFacetFilter.type
        ],
        value: queryParams['country']
      },
      city: { // type: facet filter
        config: {
          solrField: 'city_s',
          alias: 'city',
          label: 'City',
          sortAlpha: true,
          minCount: 1
        },
        processQueryActions: [processFacetFilter.type],
        value: queryParams.city
      },
      page: {
        config: {
          rows: 10,
          alias: 'page',
        },
        processQueryActions: [processPager.type],
        value: queryParams.page || 0
      },
      sort: {
        config: {
          alias: 'sort',
          options: [
            {label: 'Relevance', value: ''},
            {label: 'A-Z', value: 'last_name_t asc'},
            {label: 'Z-A ', value: 'last_name_t desc'},
          ],
        },
        processQueryActions: [processSort.type],
        value: '',
      },
    };

    dispatch(createApp({
      id: 'searchApp',
      endpoint: process.env.REACT_APP_SOLR_ENDPOINT as string,
      config: {
        setQuery: setQuery,
        preprocessQuery: preprocessQuery,
      },
      params: queryParams as any,
      filters: searchFilters,
    }));

    // Get initial results list when app loads
    dispatch(refreshResults({appId: 'searchApp'}));
  }

  // setupQuerySync(store, 'searchApp', Object.keys(searchFilters));
  return (
    <div className="App">
      <header className="App-header">
        <h1>Solang Test</h1>
      </header>
      <TestSolang></TestSolang>
    </div>
  );
}

export default App;
