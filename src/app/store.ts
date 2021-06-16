import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import { combineEpics } from 'redux-observable';

import solangReducer from '../features/solang/solang.slice';
import { paramsEpic, buildQueryEpic, sendQueryEpic } from "../features/solang/solang.epic";

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    solang: solangReducer
  },
  middleware: [
    epicMiddleware
  ]
});

export const rootEpic = combineEpics(
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
