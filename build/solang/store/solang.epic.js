"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendQueryEpic = exports.processQueryEpic = exports.processParamsEpic = void 0;
const operators_1 = require("rxjs/operators");
const redux_observable_1 = require("redux-observable");
const solang_slice_1 = require("./solang.slice");
const solang_api_1 = require("../solang.api");
/**
 * processParamsEpic executes after any actions which change a solr app's parameters.
 * This triggers the buildQuery action which in turn triggers the buildQueryEpic.
 * @param action$
 */
const processParamsEpic = (action$) => {
    return action$.pipe(operators_1.filter((action) => {
        return [
            solang_slice_1.setParams.type,
            solang_slice_1.setParam.type
        ].includes(action.type);
    }), operators_1.tap(action => console.log('processParamsEpic', action)), operators_1.map((action) => {
        return {
            type: solang_slice_1.buildQuery.type,
            payload: { appId: action.payload.appId }
        };
    }));
};
exports.processParamsEpic = processParamsEpic;
/**
 *
 * @param action$
 * @param state$
 */
const processQueryEpic = (action$, state$) => {
    return action$.pipe(operators_1.filter((action) => action.type === solang_slice_1.buildQuery.type), operators_1.tap(action => console.log('buildQueryEpic starting', action)), operators_1.switchMap((action) => {
        // Get the state for this application
        const app = solang_slice_1.getAppFromState(state$.value.solang, action.payload.appId);
        if (!app) {
            throw new Error('No app ${action.payload.appId} in buildQueryEpic');
        }
        // Iterate through the filters, run the appropriate reducers for each.
        const params = app.params;
        let query = {};
        const processActions = [];
        Object.keys(app.filters).forEach(key => {
            app.filters[key].processQueryActions.forEach(actionType => {
                if (actionType) {
                    // Create a new action with the application & filter
                    const newAction = {
                        type: actionType,
                        payload: {
                            appId: action.payload.appId,
                            filter: key
                        }
                    };
                    processActions.push(newAction);
                }
            });
        });
        processActions.push({
            type: solang_slice_1.sendQuery.type,
            payload: {
                appId: action.payload.appId,
                query: query
            }
        });
        return processActions;
    }));
};
exports.processQueryEpic = processQueryEpic;
/**
 * sendQueryEpic fires when the solr query has been changed by sendQuery. Any new (sendQuery) action occurring before
 * the current query completes will cancel the current query.
 * @param action$
 * @param state$
 */
const sendQueryEpic = (action$, state$) => {
    return action$.pipe(redux_observable_1.ofType(solang_slice_1.sendQuery.type), operators_1.tap(action => console.log('sendQueryEpic', action)), 
    // Switch Map will auto-cancel any previous instance.
    operators_1.switchMap((action) => {
        const app = solang_slice_1.getAppFromState(state$.value.solang, action.payload.appId);
        if (app) {
            return solang_api_1.createSolrQueryObs(app).pipe(operators_1.map(response => {
                return {
                    type: solang_slice_1.resultsReceived.type,
                    payload: {
                        appId: action.payload.appId,
                        response: response
                    }
                };
            }));
        }
        else {
            throw (new Error('No solang app!'));
        }
    }));
};
exports.sendQueryEpic = sendQueryEpic;
//# sourceMappingURL=solang.epic.js.map