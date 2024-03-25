import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {getFilterFromState, ISolangState, setParam} from "../../store/solang.slice";
import {IDateRangeState} from "../../filters/DateRangeFilter";

interface MyProps {
  appId: string;
  alias: string;
}

/**
 * Provides checkbox filter for categories with result counts.
 * @param appId
 * @param alias
 * @constructor
 */
const DateRange = ({appId, alias}: MyProps) => {

  const CLASS = 'solang-date-range';
  const dispatch = useDispatch();

  const filterState = useSelector((state: ISolangState) => getFilterFromState(state.solang, appId, alias)) as IDateRangeState;

  const handleFromChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    dispatch(setParam({appId: appId, key: `${alias}From`, value: value}));
  }
  const handleToChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    // setToValue(value);
    dispatch(setParam({appId: appId, key: `${alias}To`, value: value}));
  }

  const from = filterState.from;
  const to = filterState.to;

  return (
    <div className={CLASS}>
      <label className={`{$CLASS}__label-from`} htmlFor={`${alias}-from`}>From</label>
      <input className={`${CLASS}__from`} type="date" id={`${alias}-from`} onChange={handleFromChange} defaultValue={from}/>
      <label className={`{$CLASS}__label-to`} htmlFor={`${alias}-to`}>To</label>
      <input className={`${CLASS}__to`} type="date" id={`${alias}-to`} onChange={handleToChange} defaultValue={to}/>
    </div>
  );

}

export default DateRange;
