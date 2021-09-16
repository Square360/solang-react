"use strict";
exports.__esModule = true;
exports.SolangEpic = exports.sendQueryEpic = exports.processQueryEpic = exports.processParamsEpic = void 0;
var operators_1 = require("rxjs/operators");
var redux_observable_1 = require("redux-observable");
var solang_slice_1 = require("./solang.slice");
var solang_api_1 = require("../solang.api");
/**
 * processParamsEpic executes after any actions which change a solr app's parameters.
 * This triggers the buildQuery action which in turn triggers the buildQueryEpic.
 * @param action$
 */
var processParamsEpic = function (action$, state$) {
    return action$.pipe(operators_1.filter(function (action) {
        return [
            solang_slice_1.setParams.type,
            solang_slice_1.setParam.type,
            solang_slice_1.refreshResults.type,
        ].includes(action.type);
    }), operators_1.tap(function (action) { return console.log('processParamsEpic', action); }), operators_1.tap(function (action) {
        var _a;
        // Update query parameters
        var app = solang_slice_1.getAppFromState(state$.value.solang, action.payload.appId);
        if ((_a = app === null || app === void 0 ? void 0 : app.config) === null || _a === void 0 ? void 0 : _a.setQuery) {
            app.config.setQuery(app.params);
        }
    }), 
    // If triggering params updates externally, do not trigger buildQuery
    // filter( (action: AnyAction) => {
    //   const app = getAppFromState(state$.value.solang, action.payload.appId);
    //   return (app.config?.externalParams === false)
    // }),
    operators_1.map(function (action) {
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
var processQueryEpic = function (action$, state$) {
    return action$.pipe(operators_1.filter(function (action) { return action.type === solang_slice_1.buildQuery.type; }), operators_1.tap(function (action) { return console.log('buildQueryEpic starting', action); }), operators_1.switchMap(function (action) {
        // Get the state for this application
        var app = solang_slice_1.getAppFromState(state$.value.solang, action.payload.appId);
        if (!app) {
            throw new Error('No app ${action.payload.appId} in buildQueryEpic');
        }
        // Iterate through the filters, run the appropriate reducers for each.
        var params = app.params;
        var query = {};
        var processActions = [];
        Object.keys(app.filters).forEach(function (key) {
            app.filters[key].processQueryActions.forEach(function (actionType) {
                if (actionType) {
                    // Create a new action with the application & filter
                    var newAction = {
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
var sendQueryEpic = function (action$, state$) {
    return action$.pipe(redux_observable_1.ofType(solang_slice_1.sendQuery.type), operators_1.tap(function (action) { return console.log('sendQueryEpic', action); }), 
    // Switch Map will auto-cancel any previous instance.
    operators_1.switchMap(function (action) {
        var app = solang_slice_1.getAppFromState(state$.value.solang, action.payload.appId);
        if (app) {
            return solang_api_1.createSolrQueryObs(app).pipe(operators_1.map(function (response) {
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
exports.SolangEpic = redux_observable_1.combineEpics(exports.processParamsEpic, 
// buildQueryEpic,
exports.processQueryEpic, exports.sendQueryEpic);
