import {  AnyAction } from "@reduxjs/toolkit";
import { filter, map, switchMap, tap, mergeMap } from 'rxjs/operators';
import { ofType } from "redux-observable";
import { setParam, setParams, buildQuery, sendQuery, getAppFromState, resultsReceived } from './solang.slice';
import { createSolrQueryObs } from "./solang.api";

/**
 * processParamsEpic executes after any actions which change a solr app's parameters.
 * This triggers the buildQuery action which in turn triggers the buildQueryEpic.
 * @param action$
 */
export const processParamsEpic = (action$: any) => {
  return action$.pipe(
    filter((action: any) => {
      return [
        setParams.type,
        setParam.type
      ].includes(action.type);
    }),
    tap(action => console.log('processParamsEpic', action)),
    map((action: AnyAction) => {
      return {
        type: buildQuery.type,
        payload: {appId: action.payload.appId}
      }
    }),
  );
}

/**
 *
 * @param action$
 * @param state$
 */
export const processQueryEpic = (action$: any, state$: any) => {
  return action$.pipe(

    filter((action: AnyAction)  => action.type === buildQuery.type),
    tap(action => console.log('buildQueryEpic starting', action)),
    switchMap( (action: AnyAction) => {

      // Get the state for this application
      const app = getAppFromState(state$.value.solang, action.payload.appId);
      if (!app) {
        throw new Error('No app ${action.payload.appId} in buildQueryEpic');
      }

      // Iterate through the filters, run the appropriate reducers for each.
      const params = app.params;
      let query = {};

      const processActions = [];
      Object.keys(app.filters).forEach( key => {
        app.filters[key].processQueryActions.forEach( actionType => {
          if (actionType) {
            // Create a new action with the application & filter
            const newAction = {
              type: actionType,
              payload: {
                appId: action.payload.appId,
                filter: key
              }
            }
            processActions.push(newAction);
          }
        })
      });

      processActions.push({
        type: sendQuery.type,
        payload: {
          appId: action.payload.appId,
          query: query
        }
      });

      return processActions;
    })
  );
}


/**
 * sendQueryEpic fires when the solr query has been changed by sendQuery. Any new (sendQuery) action occurring before
 * the current query completes will cancel the current query.
 * @param action$
 * @param state$
 */
export const sendQueryEpic = (action$: any, state$: any) => {
  return action$.pipe(
    ofType(sendQuery.type),
    tap(action => console.log('sendQueryEpic', action)),
    // Switch Map will auto-cancel any previous instance.
    switchMap( (action: AnyAction) => {

      const app = getAppFromState(state$.value.solang, action.payload.appId);
      if (app) {
        return createSolrQueryObs(app).pipe(
          map(response => {
            return {
              type: resultsReceived.type,
              payload: {
                appId: action.payload.appId,
                response: response
              }
            }
          })
        );
      }
      else {
        throw(new Error('No solang app!'));
      }
    })
  );
}


