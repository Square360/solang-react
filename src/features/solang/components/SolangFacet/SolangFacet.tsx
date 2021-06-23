import { useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { getAppFromState, getFacetCountsFromState, getFilterFromState } from "../../solang.slice";

import './slng-facet.scss';

interface MyProps {
  alias: string
}

const SolangFacet = ({alias}: MyProps) => {

  const filterState  = useAppSelector((state: RootState) => getFilterFromState(state.solang, 'searchApp', alias) );

  const facetCounts  = useAppSelector((state: RootState) => getFacetCountsFromState(state.solang, 'searchApp', alias) );

  return (

    <div className={'slng-facet'}>
      <fieldset>
        {filterState.config.label && <legend>{filterState.config.label}</legend>}

        <ul>
          { facetCounts.map( ({value, count}) => (
            <li>{value} ({count})</li>
          ))}
        </ul>

      </fieldset>


    </div>

  );
};


export default SolangFacet;
