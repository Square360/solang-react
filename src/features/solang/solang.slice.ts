import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SolangApp, SolangParamList, SolangState, SolrQuery, SolrResults } from "./solang.types";

export const getAppFromState = (state: SolangState, appId: string) => {
  let app = state.apps[appId];
  if (app) {
    return app;
  }
  else {
    // ToDo: Error
    console.log(`App ${appId} doesn't exist!`);
  }
}


const initialState: SolangState = {
  config: {},
  apps: {},
};

export interface setParamsPayload {appId: string, params: SolangParamList};
export interface buildQueryPayload {appId: string, query: SolrQuery};
export interface sendQueryPayload {appId: string;query: SolrQuery;}
export interface resultsReceivedPayload {appId: string; results: SolrResults;}

export const SolangSlice = createSlice({
  name: 'solang',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    createApp: (state: SolangState, action: PayloadAction<SolangApp>) => {
      if (!state.apps[action.payload.id]) {
        state.apps[action.payload.id] = action.payload
      }
      else {
        throw Error(`Solang app ${action.payload.id} already exists!`);
      }
    },
    setParams: (state: SolangState, action: PayloadAction<setParamsPayload>) => {
      const appId = action.payload.appId;
      const app: SolangApp = state.apps[appId];
      app.params = action.payload.params;
    },
    buildQuery: (state: SolangState, action: PayloadAction<any>) => {
      console.log('buildQuery reducer', action);
      const appId = action.payload.appId;
      const app: SolangApp = state.apps[appId];
      app.lastQuery = app.query || {};
      app.query = {};
    },
    sendQuery: (state: SolangState, action: PayloadAction<sendQueryPayload>) => {
      const app = state.apps[action.payload.appId];
      app.query = action.payload.query;
    },
    resultsReceived: (state: SolangState, action: PayloadAction<any>) => {
      console.log('resultsReceived', action);
      const app = state.apps[action.payload.appId];
      app.results = action.payload.results;
    }
  },
});

export const { createApp, setParams, buildQuery, sendQuery, resultsReceived } = SolangSlice.actions;


export default SolangSlice.reducer;

