import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { userInfo } from './common/userInfo.reducers';
import { combineReducers } from 'redux';
import { login } from './LoginForm/login.reducers';
import { WithUserData } from './LoginForm/withUserData';
import { categoryManualList } from './CategoryManualList/categoryManualList.reducers';
import { verifyUser } from './VerifyUserPage/verifyUser.reducers';

import '../assets/styles.scss';

class WrapperPage extends React.Component {
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
  categoryManualList,
  verifyUser
}), composeEnhancers(applyMiddleware(thunkMiddleware)));

export const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/" component={WrapperPage}/>
    </BrowserRouter>
  </Provider>
);
