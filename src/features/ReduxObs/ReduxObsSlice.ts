import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SolangParamList { [key: string]: string | string[] }

export interface  SolangFilter {
  alias: string;
  field: string;
  label?: string;
  process: (params: SolangParamList, query: {}) => {};
}

export interface SolangApp {
  id: string;
  endpoint?: string; // Maybe should be an object
  status?: 'idle' | 'loading' | 'failed',
  config?: {},
  params: SolangParamList, // url-like paramerers
  filters?: SolangFilter[]; // A definition of all filters
  results?: any[], // Define response object
  query?: {},
  lastQuery?: {},
}


export interface SolangState {
  config: {}
  apps: SolangApp[];
}

const initialState: SolangState = {
  config: {},
  apps: [],
};

export const getAppFromState = (state: SolangState, appId: string) => {
  let app = state.apps.find(app => app.id === appId);
  if (app) {
    return app;
  }
  else {
    // ToDo: Error
    console.log(`App ${appId} doesn't exist!`);
  }
}

export const reduxObsSlice = createSlice({
  name: 'solang',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    createApp: (state, action: PayloadAction<SolangApp>) => {
      state.apps.push(action.payload);
    },
    updateApp: (state, action: PayloadAction<SolangApp>) => {
      let appIndex = state.apps.findIndex(app => app.id === action.payload.id);
      if (appIndex >= 0) {
        state.apps[appIndex] = action.payload;
      } else {
        console.log(`App ${action.payload.id} doesn't exist!`);
      }
    },
    setParams: (state, action: PayloadAction<{appId: string, params: SolangParamList}>) => {
      let appIndex = state.apps.findIndex(app => app.id === action.payload.appId);

      state.apps[appIndex].params = action.payload.params;
      console.log(action.payload.params);
      console.log(state.apps[appIndex].params);
    },
    buildQuery: (state, action: PayloadAction<any>) => {
      console.log('buildQuery reducer', action);
      let appIndex = state.apps.findIndex(app => app.id === action.payload.appId);
      if (appIndex >= 0) {
        state.apps[appIndex].lastQuery = state.apps[appIndex].query || {};
        state.apps[appIndex].query = {};
      }
    },
    sendQuery: (state, action: PayloadAction<any>) => {
      console.log('sendQuery reducer', action);
      let appIndex = state.apps.findIndex(app => app.id === action.payload.appId);
      state.apps[appIndex].query = action.payload.query;
    },
    resultsReceived: (state, action: PayloadAction<any>) => {
      console.log('resultsReceived', action);
      let appIndex = state.apps.findIndex(app => app.id === action.payload.appId);
      console.log(state.apps[appIndex]);
      state.apps[appIndex].results = action.payload.results;
      // console.log()
    }
  },
});

export const { setParams, createApp, updateApp, buildQuery, sendQuery, resultsReceived } = reduxObsSlice.actions;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd = (amount: number): AppThunk => (
//   dispatch,
//   getState
// ) => {
//   const currentValue = selectCount(getState());
//   if (currentValue % 2 === 1) {
//     dispatch(incrementByAmount(amount));
//   }
// };

export default reduxObsSlice.reducer;

