import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDispatch, useSelector } from "react-redux";
import { getAppFromState, getFilterFromState, setParam } from "../../store/solang.slice";
/**
 * Provides checkbox filter for categories with result counts.
 * @param appId
 * @param alias
 * @constructor
 */
const SortSelect = ({ appId, alias, inputName }) => {
    const CLASS = 'solang-radio-options';
    const dispatch = useDispatch();
    const filterState = useSelector((state) => getFilterFromState(state.solang, appId, alias));
    const defaultValue = useSelector((state) => getAppFromState(state.solang, appId).params[alias]);
    const updateHandler = (e) => {
        const el = e.currentTarget;
        dispatch(setParam({ appId: appId, key: alias, value: el.value }));
    };
    return (_jsx("div", Object.assign({ className: CLASS }, { children: filterState.config.options.map((item, index) => (_jsxs("span", Object.assign({ className: `${CLASS}__item` }, { children: [_jsx("label", Object.assign({ htmlFor: `${inputName}--${index}`, className: `${CLASS}__label` }, { children: item.label }), void 0),
                _jsx("input", { type: "radio", id: `${inputName}--${index}`, value: item.value, className: `${CLASS}__input`, name: inputName, checked: defaultValue === item.value, onChange: updateHandler }, item.value)] }), void 0))) }), void 0));
};
export default SortSelect;
//# sourceMappingURL=SortRadio.js.map