import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDispatch } from 'react-redux';
import { setParam } from "../../store/solang.slice";
import './FacetCheckbox.scss';
/**
 * Provides Checkbox facet filter
 * @param appId
 * @param filterState
 * @param facetCounts
 * @constructor
 */
const FacetCheckbox = ({ appId, filterState, facetCounts, }) => {
    const CLASS = 'facet-cb';
    const dispatch = useDispatch();
    const alias = filterState.config.alias;
    const changeHandler = (e) => {
        let newState = [...filterState.value];
        let value = e.target.value;
        if (e.target.checked && !newState.includes(value)) {
            newState.push(value);
            dispatch(setParam({ appId: appId, key: alias, value: newState }));
        }
        else if (!e.target.checked && newState.includes(value)) {
            dispatch(setParam({ appId: appId, key: alias, value: newState.filter(v => v !== value) }));
        }
    };
    return (_jsx("div", Object.assign({ className: `${CLASS}` }, { children: _jsxs("fieldset", { children: [filterState.config.label && _jsx("legend", { children: filterState.config.label }, void 0),
                _jsx("ul", Object.assign({ className: `${CLASS}__list` }, { children: Object.keys(facetCounts).map((value) => (_jsx("li", Object.assign({ className: `${CLASS}__list-item` }, { children: _jsxs("label", Object.assign({ className: `${CLASS}__label` }, { children: [_jsx("input", { type: "checkbox", checked: filterState.value.includes(value), onChange: changeHandler, value: value, name: alias }, void 0), " ", _jsx("span", Object.assign({ className: `${CLASS}__value` }, { children: value }), void 0), "  ", _jsxs("span", Object.assign({ className: `${CLASS}__count` }, { children: ["(", facetCounts[value], ")"] }), void 0)] }), void 0) }), void 0))) }), void 0)] }, void 0) }), void 0));
};
export default FacetCheckbox;
//# sourceMappingURL=FacetCheckbox.js.map