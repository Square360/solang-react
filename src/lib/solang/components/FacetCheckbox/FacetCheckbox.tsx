import { useDispatch } from 'react-redux'
import {getAppFromState, setParam} from "../../store/solang.slice";
import {
  facetFilterGetCountsFromAppState,
  IFacetFilterState
} from "../../filters/FacetFilter";
import { ChangeEvent } from "react";
import { ISolrFacetField } from "../../solang.types";
import {useAppSelector} from "../../../../app/store/hooks";
import {RootState} from "../../../../app/store/store";

// import './FacetCheckbox.scss';

interface MyProps {
  appId: string,
  filterState: IFacetFilterState,
  facetCounts: ISolrFacetField,
}

/**
 * Provides Checkbox facet filter
 * @param appId
 * @param filterState
 * @param facetCounts
 * @constructor
 */
const FacetCheckbox = ({appId, filterState, facetCounts, }: MyProps) => {

  const CLASS = 'facet-cb';
  const dispatch = useDispatch();
  const alias = filterState.config.alias;

  const searchState = useAppSelector((state: RootState) => getAppFromState(state.solang, appId) );

  const options = facetFilterGetCountsFromAppState(searchState, alias);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {

    let newState = [...filterState.value];
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

        <ul className={`${CLASS}__list`}>
          { options.map( (option, index) => (
            <li className={`${CLASS}__list-item`} key={`${appId}--${alias}--${index}`}>
              <label  className={`${CLASS}__label`}>
                <input
                  type="checkbox"
                  checked={filterState.value.includes(option.value)}
                  onChange={changeHandler}
                  value={option.value}
                  name={alias}/> <span className={`${CLASS}__value`}>{option.value}</span>  <span className={`${CLASS}__count`}>({option.count})</span>
              </label>
            </li>
          ))}
        </ul>

      </fieldset>


    </div>

  );
};


export default FacetCheckbox;
