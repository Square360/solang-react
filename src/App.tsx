import React from 'react';
import { TestSolang } from './features/TestSolang/TestSolang';
import './App.css';
import { useAppSelector, useAppDispatch } from "./app/hooks";
import { RootState } from "./app/store";
import {
  createApp,
  getAppFromState,
  processFacetFilter,
  processSimpleFilter
} from "./features/solang/solang.slice";

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
