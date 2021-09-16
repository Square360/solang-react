import { useDispatch, useSelector } from "react-redux";
import {getAppFromState, getFilterFromState, ISolangState, setParam} from "../../store/solang.slice";
import { getCountFromResponse } from "../../filters/SimplePager";

interface MyProps {
  appId: string
  alias: string
  next?: string;
  prev?: string;
}

/**
 * Provides checkbox filter for categories with result counts.
 * @param appId
 * @param alias
 * @constructor
 */
const SimplePager = ({appId, alias, next='Next', prev='Previous'}: MyProps) => {

  const CLASS = 'solang-pager';
  const dispatch = useDispatch();

  const filterState = useSelector((state: ISolangState) => getFilterFromState(state.solang, appId, alias));
  const numFound = useSelector((state: ISolangState) => getCountFromResponse(state.solang, appId));

  const defaultValue = useSelector((state: ISolangState) => getAppFromState(state.solang, appId).params['alias']);
  const currentPage = filterState.value || defaultValue;
  const numPages = Math.ceil(numFound / filterState.config.rows);

  const isEnd = currentPage >= (numPages-1);
  const isStart = currentPage <= 0;

  const nextHandler = () => {
    const newPage = (currentPage < numPages) ? currentPage+1 : numPages;
    const val = newPage.toString();
    dispatch(setParam({appId: appId, key: alias, value: val}));
  }

  const prevHandler = () => {
    const newPage = (currentPage > 0) ? currentPage-1 : 0;
    const val = newPage.toString() ;
    dispatch(setParam({appId: appId, key: alias, value: val}));
  }

  return (
    <div className={CLASS}>

      { !isStart && <button className={`${CLASS}__prev`} onClick={prevHandler}>{prev}</button> }
      { !isEnd && <button className={`${CLASS}__next`} onClick={nextHandler}>{next}</button> }

    </div>

  );

}

export default SimplePager;
