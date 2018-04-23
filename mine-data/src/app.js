import React, { Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { userInfo } from './common/userInfo.reducers';
import { combineReducers } from 'redux';
import { login } from './LoginForm/login.reducers';
import { withUserData } from './LoginForm/withUserData';
import { LoginPage } from './LoginPage/LoginPage';
import { LogoutLink } from './logout/LogoutLink';
import { CategoryManualList } from './CategoryManualList/CategoryManualList';
import { categoryManualList } from './CategoryManualList/categoryManualList.reducers';

import '../assets/styles.scss';

const WithUserData = withUserData(
  LoginPage,
  () => <div>Loading...</div>,
  () => (
    <Fragment>
      <h1>GSP</h1>
      <CategoryManualList/>
      <LogoutLink>Logout</LogoutLink>
    </Fragment>
  )
);

class HomePage extends React.Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push('/mine-data');
    }
  }

  render() {
    return (
      <Route path="/mine-data" render={(props) => {
        return (
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-sm-8">
                <WithUserData {...props}/>
              </div>
            </div>
          </div>
        );
      }}/>
    );
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(combineReducers({
  userInfo,
  login,
  categoryManualList
}), composeEnhancers(applyMiddleware(thunkMiddleware)));

export const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/" component={HomePage}/>
    </BrowserRouter>
  </Provider>
);
