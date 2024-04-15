import { getFilterFromApp } from "../store/solang.slice";
export function optionsListProcessParams(app, filterId, params) {
    const filter = getFilterFromApp(app, filterId);
    const activeOptions = [];
    Object.keys(params).forEach(key => {
        var _a;
        const excludeList = (_a = filter.config.exclude) !== null && _a !== void 0 ? _a : [];
        const exclude = !(excludeList.indexOf(key) === -1);
        const label = filter.config.map[key];
        if (!exclude && label) {
            let values;
            if (Array.isArray(params[key])) {
                values = params[key];
            }
            else {
                values = [params[key]];
            }
            values.forEach(item => {
                if (item.length) {
                    activeOptions.push({
                        key: key,
                        label: label,
                        value: item
                    });
                }
            });
        }
    });
    filter.activeOptions = activeOptions;
}
//# sourceMappingURL=OptionsList.js.map