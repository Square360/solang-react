import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  getAppFromState,
  setParams,
} from '../../../lib/solang/store/solang.slice';

import { RootState } from "../../store/store";
import { ISolangParamList } from "../../../lib/solang/solang.types";
import SolangFacet from "../../../lib/solang/components/SolangFacet/SolangFacet";
import PrettyPrintJson from "../../utils/components/PrettyPrintJson/PrettyPrintJson";
import SimplePager from "../../../lib/solang/components/SimplePager/SimplePager";

import './TestSolang.scss';


export const TestSolang = () => {

  const APP_ID = 'searchApp';
  const FILTER_KEY = 'searchText';
  const NUM_ROWS = 10;

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

  const offset = searchApp.response?.response.start || 0;
  const numFound = searchApp.response?.response.numFound || 0;
  const currentPage = Math.ceil(offset / NUM_ROWS);
  const numPages = Math.ceil(numFound / NUM_ROWS);


  return (
    <div>
      <PrettyPrintJson data={searchApp.params}></PrettyPrintJson>
      <h2>Testing Redux Observables</h2>
      <div className={'row'}>
        <label htmlFor='val'>Param value:</label>
        <input
          id='val'
          aria-label="Set increment amount"
          defaultValue={searchParameter}
          onChange={(e) => setSearchString(e.target.value)}
        />

        <button
          aria-label="Decrement value"
          onClick={updateParams}
        >
          Set as param
        </button>
      </div>
      <p>Internal param value: {getSearchString}</p>
      <p>Solang value: {searchParameter}</p>

      <SolangFacet appId={APP_ID} alias={'country'}></SolangFacet>

      <p>Showing {NUM_ROWS} of {numFound} results. Page {currentPage}</p>

      { results && (
        <ul>
          {results.map(item => (
            <li key={item.id}>{item.first_name_s} {item.last_name_s}</li>
          ))}
        </ul>
      )}

      <SimplePager appId={APP_ID} alias={'page'}></SimplePager>
      <PrettyPrintJson data={results}></PrettyPrintJson>

    </div>
  );
}
