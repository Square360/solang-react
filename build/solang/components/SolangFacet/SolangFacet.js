"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_redux_1 = require("react-redux");
const solang_slice_1 = require("../../store/solang.slice");
const FacetFilter_1 = require("../../filters/FacetFilter");
/**
 * Provides checkbox filter for categories with result counts.
 * @param appId
 * @param alias
 * @constructor
 */
const SolangFacet = ({ appId, alias }) => {
    const CLASS = 'solang-facet';
    const dispatch = react_redux_1.useDispatch();
    const filterState = react_redux_1.useSelector((state) => solang_slice_1.getFilterFromState(state.solang, appId, alias));
    const facetCounts = react_redux_1.useSelector((state) => FacetFilter_1.facetFilterGetCountsFromState(state.solang, appId, alias));
    const filterSelected = react_redux_1.useSelector((state) => {
        const app = solang_slice_1.getAppFromState(state.solang, appId);
        return app ? app.params[alias] || [] : [];
    });
    const changeHandler = (e) => {
        let newState = [...filterSelected];
        let value = e.target.value;
        if (e.target.checked && !newState.includes(value)) {
            newState.push(value);
            dispatch(solang_slice_1.setParam({ appId: appId, key: alias, value: newState }));
        }
        else if (!e.target.checked && newState.includes(value)) {
            dispatch(solang_slice_1.setParam({ appId: appId, key: alias, value: newState.filter(v => v !== value) }));
        }
    };
    return (jsx_runtime_1.jsx("div", Object.assign({ className: `${CLASS}` }, { children: jsx_runtime_1.jsxs("fieldset", { children: [filterState.config.label && jsx_runtime_1.jsx("legend", { children: filterState.config.label }, void 0),
                jsx_runtime_1.jsxs("p", { children: ["Selected: ", filterSelected.join(', ')] }, void 0),
                jsx_runtime_1.jsx("ul", Object.assign({ className: `${CLASS}__list` }, { children: facetCounts.map(({ value, count }) => (jsx_runtime_1.jsx("li", Object.assign({ className: `${CLASS}__list-item` }, { children: jsx_runtime_1.jsxs("label", Object.assign({ className: `${CLASS}__label` }, { children: [jsx_runtime_1.jsx("input", { type: "checkbox", checked: filterSelected.includes(value), onChange: changeHandler, value: value, name: alias }, void 0), " ", jsx_runtime_1.jsx("span", Object.assign({ className: `${CLASS}__value` }, { children: value }), void 0), "  ", jsx_runtime_1.jsxs("span", Object.assign({ className: `${CLASS}__count` }, { children: ["(", count, ")"] }), void 0)] }), void 0) }), void 0))) }), void 0)] }, void 0) }), void 0));
};
exports.default = SolangFacet;
//# sourceMappingURL=SolangFacet.js.map