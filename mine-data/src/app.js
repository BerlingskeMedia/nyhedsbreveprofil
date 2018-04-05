import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { MyDataPage } from './MyDataPage/MyDataPage';
import { Provider } from 'react-redux';
import reducers from './reducers';
import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

import '../assets/styles.scss';

class HomePage extends React.Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push('/mine-data');
    }
  }

  render() {
    return (
      <Route path="/mine-data" component={MyDataPage}/>
    );
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleware)));

export const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/" component={HomePage}/>
    </BrowserRouter>
  </Provider>
);
