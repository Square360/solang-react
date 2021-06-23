import { useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { getAppFromState, getFacetCountsFromState, getFilterFromState } from "../../solang.slice";

import './solang-facet.scss';

interface MyProps {
  alias: string
}

const SolangFacet = ({alias}: MyProps) => {

  const CLASS = 'solang-facet';

  const filterState  = useAppSelector((state: RootState) => getFilterFromState(state.solang, 'searchApp', alias) );

  const facetCounts  = useAppSelector((state: RootState) => getFacetCountsFromState(state.solang, 'searchApp', alias) );

  return (

    <div className={`${CLASS}`}>
      <fieldset>
        {filterState.config.label && <legend>{filterState.config.label}</legend>}
        <ul className={`${CLASS}__list`}>
          { facetCounts.map( ({value, count}) => (
            <li className={`${CLASS}__list-item`}>
              <label  className={`${CLASS}__label`}>
                <input type="checkbox" value={value} name={alias}/> <span className={`${CLASS}__value`}>{value}</span>  <span className={`${CLASS}__count`}>({count})</span>
              </label>
            </li>
          ))}
        </ul>

      </fieldset>


    </div>

  );
};


export default SolangFacet;
