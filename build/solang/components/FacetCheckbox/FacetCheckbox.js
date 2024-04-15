import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDispatch } from 'react-redux';
import { setParam } from "../../store/solang.slice";
/**
 * Provides Checkbox facet filter
 * @param appId
 * @param filterState
 * @param facetCounts
 * @constructor
 */
const FacetCheckbox = ({ appId, filterState, facetCounts }) => {
    const CLASS = 'solang-facet-cb';
    const dispatch = useDispatch();
    const alias = filterState.config.alias;
    const options = facetCounts || [];
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
    return (_jsx("div", Object.assign({ className: `${CLASS}` }, { children: _jsxs("fieldset", Object.assign({ className: `${CLASS}__wrapper` }, { children: [filterState.config.label && _jsx("legend", { children: filterState.config.label }, void 0),
                _jsx("ul", Object.assign({ className: `${CLASS}__list` }, { children: options && options.map((option, index) => (_jsx("li", Object.assign({ className: `${CLASS}__list-item` }, { children: _jsxs("label", Object.assign({ className: `${CLASS}__label` }, { children: [_jsx("input", { type: "checkbox", className: `${CLASS}__input`, checked: filterState.value.includes(option.value), onChange: changeHandler, value: option.value, name: alias }, void 0),
                                _jsxs("span", Object.assign({ className: `${CLASS}__desc` }, { children: [_jsx("span", { className: `${CLASS}__value`, dangerouslySetInnerHTML: { __html: option.value } }, void 0),
                                        _jsx("span", Object.assign({ className: `${CLASS}__count`, "aria-label": `${option.count} results` }, { children: option.count }), void 0)] }), void 0)] }), void 0) }), `${appId}--${alias}--${index}`))) }), void 0)] }), void 0) }), void 0));
};
export default FacetCheckbox;
//# sourceMappingURL=FacetCheckbox.js.map