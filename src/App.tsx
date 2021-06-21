import React from 'react';
import logo from './logo.svg';
import { TestSolang } from './features/TestSolang/TestSolang';
import './App.css';
import { SolangResults } from "./components/solang-results/solang-results";
import { useAppSelector } from "./app/hooks";
import { RootState } from "./app/store";
import { getAppFromState } from "./features/solang/solang.slice";
import PrettyPrintJson from "./utils/components/PrettyPrintJson/PrettyPrintJson";

function App() {

    const searchApp = useAppSelector((state: RootState) => getAppFromState(state.solang, 'searchApp') );



    return (
      <div className="App">
        <header className="App-header">
          <h1>ReduxObs</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <TestSolang></TestSolang>
      </div>
    );
}

export default App;
