import React, { Fragment } from 'react';
import { Link, Route } from 'react-router-dom';
import { withUserData } from '../LoginForm/withUserData';
import { LogoutLink } from '../logout/LogoutLink';
import { LoginPage } from '../LoginPage/LoginPage';

const WithUserData = withUserData(
  LoginPage,
  () => <div>Loading...</div>,
  ({match}) => (
    <Fragment>
      <h1>Mine data</h1>
      <h2>
        <Link to={`${match.url}/home`}>Abonnementsregister</Link>
      </h2>
      <h2>BT-Shop/Berlingske Shop</h2>
      <h2>Internt produktionsregister til rapportering mv.</h2>
      <h2>Kundeunivers.dk</h2>
      <h2>Mail system</h2>
      <h2>Marketingsregister til markedsundersøgelser</h2>
      <h2>Marketingsregister til salg og marketing</h2>
      <h2>Marketingsregister til telemarketing</h2>
      <LogoutLink>Logout</LogoutLink>

      <Route path={`${match.url}/home`} render={() => <div>foo bar!</div>}/>
    </Fragment>
  )
);

export const MyDataPage = (props) => (
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-sm-8">
        <WithUserData {...props}/>
      </div>
    </div>
  </div>
);