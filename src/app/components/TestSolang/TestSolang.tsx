import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  getAppFromState,
  setParams,
} from '../../../lib/solang/store/solang.slice';

import styles from './TestSolang.module.css';

import { RootState } from "../../store/store";
import { ISolangParamList } from "../../../lib/solang/solang.types";
import SolangFacet from "../../../lib/solang/components/SolangFacet/SolangFacet";
import PrettyPrintJson from "../../utils/components/PrettyPrintJson/PrettyPrintJson";

export const TestSolang = () => {

  const APP_ID = 'searchApp';
  const FILTER_KEY = 'searchText';

  const dispatch = useAppDispatch();

  // @ts-ignore
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
      <div className={styles.row}>
        <label htmlFor='val'>Param value:</label>
        <input
          id='val'
          className={styles.textbox}
          aria-label="Set increment amount"
          defaultValue={searchParameter}
          onChange={(e) => setSearchString(e.target.value)}
        />

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
