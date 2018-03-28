import React, { Fragment } from 'react';
import { Link, Route } from 'react-router-dom';

export const MyDataPage = ({match}) => {
  return (
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

      <Route path={`${match.url}/home`} render={() => <div>foo bar!</div>}/>
    </Fragment>
  );
};