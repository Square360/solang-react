import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  getAppFromState, getFilterFromApp,
  setParams,
} from '../../../lib/solang/store/solang.slice';

import { RootState } from "../../store/store";
import { ISolangParamList } from "../../../lib/solang/solang.types";
import PrettyPrintJson from "../../utils/components/PrettyPrintJson/PrettyPrintJson";
import SimplePager from "../../../lib/solang/components/SimplePager/SimplePager";
import SortSelect from "../../../lib/solang/components/SortSelect/SortSelect";

import './TestSolang.scss';
import FacetCheckbox from "../../../lib/solang/components/FacetCheckbox/FacetCheckbox";
import { IFacetFilterState } from "../../../lib/solang/filters/FacetFilter";


export const TestSolang = () => {

  const APP_ID = 'searchApp';
  const FILTER_KEY = 'searchText';
  const NUM_ROWS = 10;


  const dispatch = useAppDispatch();

  // @ts-ignore
  const searchApp = useAppSelector((state: RootState) => getAppFromState(state.solang, APP_ID) );

  const results = (searchApp && searchApp.response) ? searchApp.response.response.docs : [];

  const facetCounts = (searchApp && searchApp.response && searchApp.response.facet_counts) ? searchApp.response.facet_counts : [];

  const facetCountsCountry = ("facet_fields" in facetCounts)
    ? facetCounts.facet_fields['country_s']
    : {};

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

  const resetParams = () => {
    dispatch(setParams({appId: APP_ID, params: {}}));
  }

  const offset = searchApp.response?.response.start || 0;
  const numFound = searchApp.response?.response.numFound || 0;
  const currentPage = Math.ceil(offset / NUM_ROWS);
  // const numPages = Math.ceil(numFound / NUM_ROWS);

  return (
    <div className={'TestSolang'}>
      <PrettyPrintJson data={searchApp.params}/>


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

        <button onClick={resetParams}>Reset</button>

      </div>

      <div><strong>Internal param value:</strong> {getSearchString}</div>
      <div><strong>Solang value:</strong> {searchParameter}</div>

      <FacetCheckbox
        appId={APP_ID}
        filterState={getFilterFromApp(searchApp, 'country') as IFacetFilterState}
        facetCounts={facetCountsCountry}
        />

      <p>Showing {results.length} of {numFound} results. Page {currentPage}</p>

      <SortSelect appId={APP_ID} alias={'sort'}/>
      { results && (
        <ul>
          {results.map(item => (
            <li key={item.id}>{item.first_name_s} {item.last_name_s}</li>
          ))}
        </ul>
      )}

      <SimplePager appId={APP_ID} alias={'page'}/>

      <PrettyPrintJson data={searchApp.query}/>

    </div>
  );
}
