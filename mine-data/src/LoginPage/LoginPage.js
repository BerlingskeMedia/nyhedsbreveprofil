import React from 'react';
import { LoginForm } from '../LoginForm/LoginForm';
import { InsightTable } from '../InsightTable/InsightTable';

import './LoginPage.scss';

export const LoginPage = () => (
  <div className="LoginPage">
    <h1>Welcome to GSP</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tempor
      aliquam volutpat. Donec vel molestie justo, id pretium risus.</p>
    <LoginForm/>
    <InsightTable/>
    <p>If you do not want to log in, you can send a manual request to <a href="mailto:xxx@bem.dk">xxx@bem.dk</a>.</p>
  </div>
);