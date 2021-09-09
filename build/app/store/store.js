import { configureStore } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import { SolangReducer } from '../../lib/solang/store/solang.slice';
import { SolangEpic } from "../../lib/solang/store/solang.epic";
const epicMiddleware = createEpicMiddleware();
export const store = configureStore({
    reducer: {
        solang: SolangReducer
    },
    middleware: [
        epicMiddleware
    ]
});
epicMiddleware.run(SolangEpic);
//# sourceMappingURL=store.js.map