import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <Fragment>
    <h1>Email Verification</h1>
    <p>
      Thank you, your email address is now verified on our system.
    </p>
    <Link to="/mine-data">Login here</Link>
  </Fragment>
);
