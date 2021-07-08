import React from 'react';
import './App.css';
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { RootState } from "./store/store";
import {
  createApp,
  getAppFromState,
  processFacetFilter,
  processSimpleFilter
} from "../lib/solang/store/solang.slice";
import { TestSolang } from "./components/TestSolang/TestSolang";

function App() {
  const dispatch = useAppDispatch();

  const searchApp = useAppSelector((state: RootState) => getAppFromState(state.solang, 'searchApp') );

  if (!searchApp) {
    dispatch(createApp({
      id: 'searchApp',
      endpoint: 'http://localhost:8983/solr/solang/',
      params: {
        searchText: 'Da'
      },
      filters: {
        searchText: {
          config: {
            solrField: 'first_name_t',
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
