import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { getAppFromState, getFilterFromState, setParam } from "../../solang.slice";

import './solang-facet.scss';
import { ChangeEvent } from "react";
import { facetFilterGetCountsFromState } from "../../filters/FacetFilter";

interface MyProps {
  appId: string
  alias: string
}

// ToDo: Display selected values even if not in facetted results.

/**
 * Provides checkbox filter for categories with result counts.
 * @param appId
 * @param alias
 * @constructor
 */
const SolangFacet = ({appId, alias}: MyProps) => {

  const CLASS = 'solang-facet';

  const dispatch = useAppDispatch();

  const filterState  = useAppSelector((state: RootState) => getFilterFromState(state.solang, appId, alias) );
  const facetCounts  = useAppSelector((state: RootState) => facetFilterGetCountsFromState(state.solang, appId, alias) )

  const filterSelected: string[] = useAppSelector((state: RootState) => {
    const app = getAppFromState(state.solang, appId);
    return app ? app.params[alias] as [] || [] : [];
  });


  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {

    let newState = [...filterSelected];
    let value = e.target.value;

    if (e.target.checked && !newState.includes(value)) {
      newState.push(value);
      dispatch(setParam({appId: appId, key: alias, value: newState}));
    }
    else if (!e.target.checked && newState.includes(value)) {
      dispatch(setParam({appId: appId, key: alias, value: newState.filter(v => v !== value)}));
    }

  }

  return (

    <div className={`${CLASS}`}>
      <fieldset>
        {filterState.config.label && <legend>{filterState.config.label}</legend>}
        <p>Selected: {filterSelected.join(', ')}</p>

        <ul className={`${CLASS}__list`}>
          { facetCounts.map( ({value, count}) => (
            <li className={`${CLASS}__list-item`}>
              <label  className={`${CLASS}__label`}>
                <input
                  type="checkbox"
                  checked={filterSelected.includes(value)}
                  onChange={changeHandler}
                  value={value}
                  name={alias}/> <span className={`${CLASS}__value`}>{value}</span>  <span className={`${CLASS}__count`}>({count})</span>
              </label>
            </li>
          ))}
        </ul>

      </fieldset>


    </div>

  );
};


export default SolangFacet;
