import React, {Fragment} from 'react';
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

import '../assets/styles.scss';

class WrapperPage extends React.Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push('/mine-data');
    }
  }

  render() {
    return (
      <Fragment>
        <Route path="/mine-data" exact render={(props) => {
          return (
            <div className="Page">
              <div className="container Page-content">
                <div className="row justify-content-center">
                  <div className="col-sm-8">
                    {props.match.isExact ? <WithUserData {...props}/> : null}
                    <Route path={`${props.match.url}/register`} component={RegisterPage}/>
                  </div>
                </div>
              </div>
              <div className="Page-footer">
                Har du spørgsmål eller problemer med denne side, så send en mail
                til <a href="mailto:persondata@berlingskemedia.dk">persondata@berlingskemedia.dk</a>
              </div>
            </div>
          );
        }}/>
        <Route path="/mine-data/valider-email" component={VerifyEmail}/>
      </Fragment>
    );
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(combineReducers({
  userInfo,
  login,
  categoryManualList,
  verifyUser,
  register
}), composeEnhancers(applyMiddleware(thunkMiddleware)));

export const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/" component={WrapperPage}/>
    </BrowserRouter>
  </Provider>
);
