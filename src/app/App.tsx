import React from 'react';
import './App.scss';
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { RootState } from "./store/store";
import {
  getAppFromState,
  createApp,
  processFacetFilter,
  processPager,
  processSimpleFilter,
  processSort
} from "../lib/solang/store/solang.slice";
import { TestSolang } from "./components/TestSolang/TestSolang";

function App() {
  const dispatch = useAppDispatch();

  const searchApp = useAppSelector((state: RootState) => getAppFromState(state.solang, 'searchApp') );

  if (!searchApp) {
    dispatch(createApp({
      id: 'searchApp',
      endpoint: process.env.REACT_APP_SOLR_ENDPOINT as string,
      params: {
        searchText: 'Da'
      },
      filters: {
        searchText: {
          config: {
            solrField: 'last_name_t',
            alias: 'searchText',
          },
          processQueryActions: [processSimpleFilter.type],
          value: []
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
          value: []
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
          value: []
        },
        page: {
          config: {
            rows: 10,
            alias: 'page',
          },
          processQueryActions: [processPager.type],
          value: 0
        },
        sort: {
          config: {
            alias: 'sort',
            options: [
              {label:'Relevance', value:''},
              {label:'A-Z',value:'last_name_t asc'},
              {label:'Z-A ',value:'last_name_t desc'},
            ],
          },
          processQueryActions: [processSort.type],
          value: '',

        },
      },
    }));
  }

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
