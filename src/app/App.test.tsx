import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import {BrowserRouter as Router, Route} from "react-router-dom";
import {QueryParamProvider} from "use-query-params";

test('Renders Test Application', () => {
  const { getByText } = render(
    <Provider store={store}>
      <Router>
        <QueryParamProvider ReactRouterRoute={Route}>
          <App />
        </QueryParamProvider>
      </Router>,
    </Provider>
  );

  expect(getByText(/Solang Test/i)).toBeInTheDocument();
});
