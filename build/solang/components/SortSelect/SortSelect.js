import { jsx as _jsx } from "react/jsx-runtime";
import { useDispatch, useSelector } from "react-redux";
import { getAppFromState, getFilterFromState, setParam } from "../../store/solang.slice";
/**
 * Provides checkbox filter for categories with result counts.
 * @param appId
 * @param alias
 * @constructor
 */
const SortSelect = ({ appId, alias, id }) => {
    const CLASS = 'solang-sort-select';
    const dispatch = useDispatch();
    const filterState = useSelector((state) => getFilterFromState(state.solang, appId, alias));
    const defaultValue = useSelector((state) => getAppFromState(state.solang, appId).params[alias]);
    const updateHandler = (e) => {
        const el = e.currentTarget;
        dispatch(setParam({ appId: appId, key: alias, value: el.value }));
    };
    return (_jsx("div", Object.assign({ className: CLASS }, { children: _jsx("select", Object.assign({ id: id, className: `${CLASS}__input`, value: defaultValue, onChange: updateHandler }, { children: filterState.config.options.map(item => (_jsx("option", Object.assign({ value: item.value, className: `${CLASS}__option` }, { children: item.label }), item.value))) }), void 0) }), void 0));
};
export default SortSelect;
//# sourceMappingURL=SortSelect.js.map