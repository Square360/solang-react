import {
  filter,
  map,
  mapTo,
  switchMap,
  tap,
  delay,
} from 'rxjs/operators';

import { of } from 'rxjs';

import { Action, AnyAction } from "@reduxjs/toolkit";

import { setParams, buildQuery, sendQuery, getAppFromState, resultsReceived } from '../features/ReduxObs/ReduxObsSlice';
import { ofType } from "redux-observable";

export const solangEpic = (action$: any) => action$.pipe(
  filter((action: Action)  => action.type === 'PING'),
  mapTo({ type: 'PONG' })
);

export const paramsEpic = (action$: any) => action$.pipe(
  filter((action: any) => {
    return [
      'solangSetParams',
      'solangSetParam',
      'solangDeleteParam',
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
          results: [
            {
              name: 'Michael',
              surname: 'Barrymore'
            },
            {
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
