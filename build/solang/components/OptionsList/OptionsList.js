import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useDispatch, useSelector } from "react-redux";
import { getAppFromState, getFilterFromApp, setParam } from "../../store/solang.slice";
const OptionsList = ({ appId }) => {
    var _a;
    const CLASS = 'solang-radio-options';
    const app = useSelector((state) => getAppFromState(state.solang, appId));
    const filterState = getFilterFromApp(app, 'options');
    const dispatch = useDispatch();
    const cancelOption = (key, value) => {
        if (Array.isArray(app.params[key])) {
            const values = app.params[key].filter((v) => v !== value);
            dispatch(setParam({ appId: appId, key: key, value: values }));
        }
        else {
            dispatch(setParam({ appId: appId, key: key, value: '' }));
        }
    };
    return (_jsx("div", Object.assign({ className: CLASS }, { children: _jsx("ul", Object.assign({ className: `${CLASS}__list`, "aria-label": "Active search filters" }, { children: (_a = filterState.activeOptions) === null || _a === void 0 ? void 0 : _a.map((option, k) => (_jsx("li", Object.assign({ className: `${CLASS}__list-item` }, { children: _jsxs("button", Object.assign({ className: `${CLASS}__btn`, "aria-label": `Remove option ${option.value} from ${option.label} filter`, onClick: () => cancelOption(option.key, option.value) }, { children: [option.label, ": ", option.value] }), void 0) }), k))) }), void 0) }), void 0));
};
export default OptionsList;
//# sourceMappingURL=OptionsList.js.map