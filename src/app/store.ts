import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import { createEpicMiddleware } from 'redux-observable';

import counterReducer from '../features/counter/counterSlice';
import solangReducer from '../features/ReduxObs/ReduxObsSlice';


import { combineEpics } from 'redux-observable';
import { solangEpic, paramsEpic, buildQueryEpic, sendQueryEpic } from "./solang.epic";


const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    solang: solangReducer
  },
  middleware: [
    epicMiddleware
  ]
});

export const rootEpic = combineEpics(
  solangEpic,
  paramsEpic,
  buildQueryEpic,
  sendQueryEpic
);

epicMiddleware.run(rootEpic);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
