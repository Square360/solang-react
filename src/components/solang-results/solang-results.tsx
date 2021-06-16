
/////////////////////
import React from 'react';
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface SolangResultsProps {
  results: any[] | undefined;
  isLoading: boolean;
}

export const SolangResults: React.FC<SolangResultsProps> = ({results, isLoading = false}) => {

  const isEmpty = Array.isArray(results) && results.length > 0;




  return (
    <div className="results">
      <h2>Results</h2>
      { isLoading && (
        <p>Loading ...</p>
      )}
      { isEmpty && (
        <p>No results found.</p>
      )}
      { !isLoading && !isEmpty && results && (
        <ul>
          {results.map(item => (
            <li key={item.id}>{item.name} {item.surname}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
