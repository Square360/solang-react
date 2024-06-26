import { filter, map, switchMap, tap } from 'rxjs/operators';
import { combineEpics, ofType } from "redux-observable";
import { setParam, setParams, buildQuery, sendQuery, refreshResults, getAppFromState, resultsReceived } from './solang.slice';
import { createSolrQueryObs } from "../solang.api";
import logger from "../logger";
/**
 * processParamsEpic executes after any actions which change a solr app's parameters.
 * This triggers the buildQuery action which in turn triggers the buildQueryEpic.
 * @param action$
 */
export const processParamsEpic = (action$, state$) => {
    return action$.pipe(filter((action) => {
        return [
            setParams.type,
            setParam.type,
            refreshResults.type,
        ].includes(action.type);
    }), tap(action => logger('processParamsEpic', action)), tap((action) => {
        var _a;
        // Update query parameters
        const app = getAppFromState(state$.value.solang, action.payload.appId);
        if ((_a = app === null || app === void 0 ? void 0 : app.config) === null || _a === void 0 ? void 0 : _a.setQuery) {
            app.config.setQuery(app.params);
        }
    }), 
    // If triggering params updates externally, do not trigger buildQuery
    // filter( (action: AnyAction) => {
    //   const app = getAppFromState(state$.value.solang, action.payload.appId);
    //   return (app.config?.externalParams === false)
    // }),
    map((action) => {
        return {
            type: buildQuery.type,
            payload: { appId: action.payload.appId }
        };
    }));
};
/**
 *
 * @param action$
 * @param state$
 */
export const processQueryEpic = (action$, state$) => {
    return action$.pipe(filter((action) => action.type === buildQuery.type), tap(action => logger('buildQueryEpic starting', action)), switchMap((action) => {
        // Get the state for this application
        const app = getAppFromState(state$.value.solang, action.payload.appId);
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
            type: sendQuery.type,
            payload: {
                appId: action.payload.appId,
                query: query
            }
        });
        return processActions;
    }));
};
/**
 * sendQueryEpic fires when the solr query has been changed by sendQuery. Any new (sendQuery) action occurring before
 * the current query completes will cancel the current query.
 * @param action$
 * @param state$
 */
export const sendQueryEpic = (action$, state$) => {
    return action$.pipe(ofType(sendQuery.type), tap(action => logger('sendQueryEpic query', action)), 
    // Switch Map will auto-cancel any previous instance.
    switchMap((action) => {
        const app = getAppFromState(state$.value.solang, action.payload.appId);
        if (app) {
            return createSolrQueryObs(app).pipe(map(response => {
                return {
                    type: resultsReceived.type,
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
export const SolangEpic = combineEpics(processParamsEpic, 
// buildQueryEpic,
processQueryEpic, sendQueryEpic);
//# sourceMappingURL=solang.epic.js.map