import { useDispatch } from 'react-redux'
import { setParam } from "../../store/solang.slice";
import { IFacetFilterState } from "../../filters/FacetFilter";
import { ChangeEvent } from "react";
import { ISolrFacetField } from "../../solang.types";

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
          { Object.keys(facetCounts).map( (value, index) => (
            <li className={`${CLASS}__list-item`} key={`${appId}--${alias}--${index}`}>
              <label  className={`${CLASS}__label`}>
                <input
                  type="checkbox"
                  checked={filterState.value.includes(value)}
                  onChange={changeHandler}
                  value={value}
                  name={alias}/> <span className={`${CLASS}__value`}>{value}</span>  <span className={`${CLASS}__count`}>({facetCounts[value]})</span>
              </label>
            </li>
          ))}
        </ul>

      </fieldset>


    </div>

  );
};


export default FacetCheckbox;
