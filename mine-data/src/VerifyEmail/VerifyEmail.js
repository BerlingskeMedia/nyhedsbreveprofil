import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <Fragment>
    <h1>E-mail bekræftelse</h1>
    <p>
      Tak! Din e-mail adresse er nu bekræftet i vores system.
    </p>
    <Link to="/mine-data">Log ind her</Link>
  </Fragment>
);
