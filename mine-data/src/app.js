import React from 'react';
import PropTypes from 'prop-types';
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
import { RegisterPage } from './RegisterPage/RegisterPage';
import { register } from './RegisterPage/register.reducers';
import VerifyEmail from './VerifyEmail/VerifyEmail';
import VerifyPending from "./VerifyEmail/VerifyPending";
import { withTracking } from './common/withTracking';
import { initialize } from 'react-ga';
import { Header } from './Header/Header';
import { createConfigReducer } from './config.reducers';

import '../assets/styles.scss';

const UserDataWithTracking = withTracking(WithUserData);

class WrapperPage extends React.Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push('/mine-data');
    }
  }

  render() {
    return (
      <Route path="/mine-data" render={props => (
        <div className="Page">
          <Header/>
          <div className="container Page-content">
            <div className="row justify-content-center">
              <div className="col-sm-8">
                {props.match.isExact ? <UserDataWithTracking {...props}/> : null}
                <Route path={`${props.match.url}/register`} component={withTracking(RegisterPage)}/>
                <Route path={`${props.match.url}/valider-email`} component={withTracking(VerifyEmail)}/>
                <Route path={`${props.match.url}/verserende-email`} component={withTracking(VerifyPending)}/>
              </div>
            </div>
          </div>
          <div className="Page-footer">
            Har du spørgsmål eller problemer med denne side, så send en mail
            til <a href="mailto:persondata@berlingskemedia.dk">persondata@berlingskemedia.dk</a>
          </div>
        </div>
      )}/>
    );
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const App = ({config}) => {
  initialize(config.trackingId);

  const store = createStore(combineReducers({
    userInfo,
    login,
    categoryManualList,
    verifyUser,
    register,
    config: createConfigReducer(config)
  }), composeEnhancers(applyMiddleware(thunkMiddleware)));

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Route path="/" component={WrapperPage}/>
      </BrowserRouter>
    </Provider>
  );
};

App.propTypes = {
  config: PropTypes.shape({
    gigyaApiKey: PropTypes.string,
    trackingId: PropTypes.string
  })
};