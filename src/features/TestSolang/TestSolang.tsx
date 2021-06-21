import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  createApp,
  getAppFromState,
  setParams,
  processFacetFilter,
  processSimpleFilter
} from '../solang/solang.slice';

import styles from './TestSolang.module.css';

import { RootState } from "../../app/store";
import { createEmptySolrQuery, SolangParamList } from "../solang/solang.types";
import PrettyPrintJson from "../../utils/components/PrettyPrintJson/PrettyPrintJson";

export const TestSolang = () => {

  const APP_ID = 'searchApp';
  const FILTER_KEY = 's';

  const dispatch = useAppDispatch();

  const searchApp = useAppSelector((state: RootState) => getAppFromState(state.solang, APP_ID) );

  const results = useAppSelector((state: RootState) => {
    const app = getAppFromState(state.solang, APP_ID);
    return app ? app.results : [];
  });

  if (!searchApp) {

    dispatch(createApp({
      id: APP_ID,
      endpoint: 'http://localhost:8983/solr/solang/',
      params: {
        s: '*'
      },
      query: createEmptySolrQuery(),
      filters: {
        s: {
          config: {
            solrField: 'first_name_t',
            alias: 's'
          },
          processQueryActions: [processSimpleFilter.type],
          value: []
        },
        country: { // type: facet filter
          config: {
            solrField: 'country_s',
            alias: 'country'
          },
          processQueryActions: [processFacetFilter.type],
          value: []
        },
      }

    }));
  }

  const paramValue = useAppSelector((state: RootState) => {
    const app = getAppFromState(state.solang, APP_ID);
    return app ? app.params[FILTER_KEY] : 'undefined';
  });

  const [getValue, setValue] = useState('2');

  const setAsParamHandler = (e: any) => {
    e.preventDefault();
    const params: SolangParamList = {};
    params[FILTER_KEY] = getValue;
    dispatch(setParams({appId: APP_ID, params: params}));
  }

  return (
    <div>
      <h2>Testing Redux Observables</h2>
      <label htmlFor='val'>Param value:</label>
      <input
        id='val'
        className={styles.textbox}
        aria-label="Set increment amount"
        value={getValue}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className={styles.row}>

        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={setAsParamHandler}
        >
          Set as param
        </button>
      </div>
      <p>Received param value: {paramValue}</p>

      { results && (
        <ul>
          {results.map(item => (
            <li key={item.id}>{item.first_name_s} {item.last_name_s}</li>
          ))}
        </ul>

      )}

      <PrettyPrintJson data={results}></PrettyPrintJson>

    </div>
  );
}
