import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDispatch, useSelector } from "react-redux";
import { getAppFromState, getFilterFromState, setParam } from "../../store/solang.slice";
import { getCountFromResponse } from "../../filters/SimplePager";
/**
 * Provides checkbox filter for categories with result counts.
 * @param appId
 * @param alias
 * @constructor
 */
const SimplePager = ({ appId, alias, next = 'Next', prev = 'Previous' }) => {
    var _a;
    const CLASS = 'solang-pager';
    const dispatch = useDispatch();
    const filterState = useSelector((state) => getFilterFromState(state.solang, appId, alias));
    const numFound = useSelector((state) => getCountFromResponse(state.solang, appId));
    const defaultValue = (_a = useSelector((state) => getAppFromState(state.solang, appId).params['alias'])) !== null && _a !== void 0 ? _a : 0;
    const currentPage = filterState.value || defaultValue;
    const numPages = Math.ceil(numFound / filterState.config.rows);
    const isEnd = currentPage >= (numPages - 1);
    const isStart = currentPage <= 0;
    const nextHandler = () => {
        const newPage = (currentPage < numPages) ? parseInt(currentPage) + 1 : numPages;
        const val = newPage.toString();
        dispatch(setParam({ appId: appId, key: alias, value: val }));
    };
    const prevHandler = () => {
        const newPage = (currentPage > 0) ? currentPage - 1 : 0;
        const val = newPage.toString();
        dispatch(setParam({ appId: appId, key: alias, value: val }));
    };
    return (_jsxs("div", Object.assign({ className: CLASS }, { children: [_jsx("button", Object.assign({ disabled: isStart, className: `${CLASS}__prev`, onClick: prevHandler }, { children: prev }), void 0),
            _jsx("button", Object.assign({ disabled: isEnd, className: `${CLASS}__next`, onClick: nextHandler }, { children: next }), void 0)] }), void 0));
};
export default SimplePager;
//# sourceMappingURL=SimplePager.js.map