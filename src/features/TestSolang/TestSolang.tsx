import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  createApp,
  getAppFromState,
  setParams,
  processFacetFilter,
  processSimpleFilter, createEmptySolrQuery
} from '../solang/solang.slice';

import styles from './TestSolang.module.css';

import { RootState } from "../../app/store";
import { ISolangParamList } from "../solang/solang.types";
import PrettyPrintJson from "../../utils/components/PrettyPrintJson/PrettyPrintJson";
import SolangFacet from "../solang/components/SolangFacet/SolangFacet";

export const TestSolang = () => {

  const APP_ID = 'searchApp';
  const FILTER_KEY = 's';

  const dispatch = useAppDispatch();

  const searchApp = useAppSelector((state: RootState) => getAppFromState(state.solang, APP_ID) );

  const results = useAppSelector((state: RootState) => {
    return ((searchApp && searchApp.response && searchApp.response.response)) ? searchApp.response.response.docs : [];
  });

  if (!searchApp) {

    dispatch(createApp({

      id: APP_ID,
      endpoint: 'http://localhost:8983/solr/solang/',
      params: {},
      query: createEmptySolrQuery(),
      filters: {
        s: {
          config: {
            solrField: 'first_name_t',
            alias: 's',
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
            sortAlpha: true
          },
          processQueryActions: [processFacetFilter.type],
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
    const params: ISolangParamList = {};
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

      <SolangFacet alias={'country'}></SolangFacet>

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
