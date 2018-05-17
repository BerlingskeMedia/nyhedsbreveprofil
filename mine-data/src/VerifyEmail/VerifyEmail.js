import React from "react";
import {Link} from "react-router-dom";

export default () => (
  <div className="Page">
    <div className="container Page-content">
      <div className="row justify-content-center">
        <div className="col-sm-8">
          <h1>Email Verification</h1>
          <span>
            Thank you, your email address is now verified on our system.
          </span>
            <br/>
          <Link to="/mine-data">Login here</Link>
        </div>
      </div>
    </div>
    <div className="Page-footer">
      Har du spørgsmål eller problemer med denne side, så send en mail
      til <a href="mailto:persondata@berlingskemedia.dk">persondata@berlingskemedia.dk</a>
    </div>
  </div>
);
