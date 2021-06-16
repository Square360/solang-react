import React from 'react';
import logo from './logo.svg';
import { ReduxObs } from './features/ReduxObs/ReduxObs';
import './App.css';
import { SolangResults } from "./components/solang-results/solang-results";
import { useAppSelector } from "./app/hooks";
import { selectCount } from "./features/counter/counterSlice";
import { RootState } from "./app/store";
import { getAppFromState } from "./features/ReduxObs/ReduxObsSlice";
import PrettyPrintJson from "./utils/components/PrettyPrintJson/PrettyPrintJson";

function App() {

    const searchApp = useAppSelector((state: RootState) => getAppFromState(state.solang, 'searchApp') );

    const results = useAppSelector((state: RootState) => {
      const app = getAppFromState(state.solang, 'searchApp');
      return app ? app.results : [];
    });

    return (
      <div className="App">
        <header className="App-header">
          <h1>ReduxObs</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <ReduxObs></ReduxObs>
        <PrettyPrintJson data={results}></PrettyPrintJson>
        {/*<SolangResults results={results} isLoading={false}></SolangResults>*/}
      </div>
    );
}

export default App;
