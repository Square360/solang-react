import { ThunkAction, Action } from '@reduxjs/toolkit';
export declare const store: import("@reduxjs/toolkit").EnhancedStore<{
    solang: import("../../lib/solang/solang.types").SolangState;
}, import("redux").AnyAction, import("redux-observable").EpicMiddleware<Action<any>, Action<any>, void, any>[]>;
export declare type AppDispatch = typeof store.dispatch;
export declare type RootState = ReturnType<typeof store.getState>;
export declare type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
