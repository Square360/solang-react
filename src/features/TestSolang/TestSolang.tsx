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


  const searchParameter = useAppSelector((state: RootState) => {
    const app = getAppFromState(state.solang, APP_ID);
    return app ? app.params[FILTER_KEY] : 'undefined';
  });

  const [getSearchString, setSearchString] = useState(searchParameter);

  const updateParams = (e: any) => {
    e.preventDefault();
    const params: ISolangParamList = {...searchApp.params};
    params[FILTER_KEY] = getSearchString;
    dispatch(setParams({appId: APP_ID, params: params}));
  }

  return (
    <div>
      <PrettyPrintJson data={searchApp.params}></PrettyPrintJson>
      <h2>Testing Redux Observables</h2>
      <label htmlFor='val'>Param value:</label>
      <input
        id='val'
        className={styles.textbox}
        aria-label="Set increment amount"
        value={searchParameter}
        onChange={(e) => setSearchString(e.target.value)}
      />

      <div className={styles.row}>

        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={updateParams}
        >
          Set as param
        </button>
      </div>
      <p>Internal param value: {getSearchString}</p>
      <p>Solang value: {searchParameter}</p>

      <SolangFacet appId={APP_ID} alias={'country'}></SolangFacet>

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
