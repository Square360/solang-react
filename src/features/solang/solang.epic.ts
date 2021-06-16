import { Action, AnyAction } from "@reduxjs/toolkit";
import { filter,  map,  mapTo,  switchMap,  tap,  delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { ofType } from "redux-observable";
import { setParams, buildQuery, sendQuery, getAppFromState, resultsReceived } from './solang.slice';

/**
 *
 * @param action$
 */
export const paramsEpic = (action$: any) => action$.pipe(
  filter((action: any) => {
    return [
      // ToDo: fill other parameter changing actions here
      setParams.type
    ].indexOf(action.type) >= 0;
  }),
  tap(action => console.log('paramsEpic', action)),
  map((action: AnyAction) => {
    return {
      type: buildQuery.type,
      payload: {appId: action.payload.appId}
    }
  }),
);

export const buildQueryEpic = (action$: any, state$: any) => action$.pipe(
  filter((action: Action)  => action.type === buildQuery.type),
  tap(action => console.log('buildQueryEpic', action)),
  map( (action: AnyAction) => {

    const app = getAppFromState(state$.value.solang, action.payload.appId);
    if (!app) {
      throw new Error('No app ${action.payload.appId} in buildQueryEpic');
    }
    const params = app.params;
    let query = {};
    const processors = app.filters ? app.filters.map(filter => filter.process) : [];

    processors.forEach( process => {
      query = process(params, query)
    });

    console.log('Final query', query);

    return {
      type: sendQuery.type,
      payload: {
        appId: action.payload.appId,
        query: query
      }
    }
  })
);

export const sendQueryEpic = (action$: any, state$: any) => action$.pipe(
  ofType(sendQuery.type),
  tap(action => console.log('sendQueryEpic', action)),
  // Switch Map will auto-cancel any previous instance.
  switchMap( (action: AnyAction) => {
    // Create a new observable form the current action
    const searchQuery$ = of(action.payload).pipe(
      tap(query => console.log('searchQuery send',query)),
      delay(5000),
      tap(query => console.log('searchQuery receive')),
      mapTo({
        type: resultsReceived.type,
        payload: {
          appId: action.payload.appId,
          results: [
            {
              id: 1,
              name: 'Michael',
              surname: 'Barrymore'
            },
            {
              id:2,
              name: 'Kenny',
              surname: 'Everett'
            }
          ]
        }

      })
    );
    return searchQuery$;
  })
);
