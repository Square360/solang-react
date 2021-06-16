import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  createApp,
  getAppFromState,
  setParams
} from '../solang/solang.slice';

import styles from './ReduxObs.module.css';

import { RootState } from "../../app/store";
import { SolangParamList } from "../solang/solang.types";

export const ReduxObs = () => {

  const APP_ID = 'searchApp';
  const FILTER_KEY = 's';

  const dispatch = useAppDispatch();

  const searchApp = useAppSelector((state: RootState) => getAppFromState(state.solang, APP_ID) );

  if (!searchApp) {
    dispatch(createApp({
      id: APP_ID,
      params: {
        s: 'unassigned'
      },
      filters: [
        {
          alias: 's',
          field: 'tm_name',
          process: (params: SolangParamList, query: any = {}) => {
            const newQuery = {...query, s: params.s};
            return newQuery;
          }
        }
      ],
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
    </div>
  );
}
