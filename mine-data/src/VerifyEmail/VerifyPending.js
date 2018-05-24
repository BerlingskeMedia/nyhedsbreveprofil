import React, {Fragment} from 'react';
import { Link } from 'react-router-dom';

export const VerifyPending = () => (
  <Fragment>
    <h1>Verserende E-mail bekræftelse</h1>
    <p>
      For din sikkerhed er der sendt en verifikations-email til dig.<br/>
      Følg instruktionerne i e-mailen for at bekræfte din konto.
      <br/>
      <Link to="/mine-data">Tilbage</Link>
    </p>
  </Fragment>
);
