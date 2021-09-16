import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSelector, useDispatch } from 'react-redux';
import { getAppFromState, getFilterFromState, setParam } from "../../store/solang.slice";
import { facetFilterGetCountsFromState } from "../../filters/FacetFilter";
/**
 * Provides checkbox filter for categories with result counts.
 * @param appId
 * @param alias
 * @constructor
 */
const SolangFacet = ({ appId, alias }) => {
    const CLASS = 'solang-facet';
    const dispatch = useDispatch();
    const filterState = useSelector((state) => getFilterFromState(state.solang, appId, alias));
    const facetCounts = useSelector((state) => facetFilterGetCountsFromState(state.solang, appId, alias));
    const filterSelected = useSelector((state) => {
        const app = getAppFromState(state.solang, appId);
        return app ? app.params[alias] || [] : [];
    });
    const changeHandler = (e) => {
        let newState = [...filterSelected];
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
                _jsxs("p", { children: ["Selected: ", filterSelected.join(', ')] }, void 0),
                _jsx("ul", Object.assign({ className: `${CLASS}__list` }, { children: facetCounts.map(({ value, count }) => (_jsx("li", Object.assign({ className: `${CLASS}__list-item` }, { children: _jsxs("label", Object.assign({ className: `${CLASS}__label` }, { children: [_jsx("input", { type: "checkbox", checked: filterSelected.includes(value), onChange: changeHandler, value: value, name: alias }, void 0), " ", _jsx("span", Object.assign({ className: `${CLASS}__value` }, { children: value }), void 0), "  ", _jsxs("span", Object.assign({ className: `${CLASS}__count` }, { children: ["(", count, ")"] }), void 0)] }), void 0) }), void 0))) }), void 0)] }, void 0) }), void 0));
};
export default SolangFacet;
//# sourceMappingURL=SolangFacet.js.map