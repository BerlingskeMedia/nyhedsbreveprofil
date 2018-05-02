import React, { Fragment } from 'react';
import { CategoryManualList } from '../CategoryManualList/CategoryManualList';
import { LogoutLink } from '../logout/LogoutLink';
import { CategoryApiList } from '../CategoryApiList/CategoryApiList';

export const HomePage = () => (
  <Fragment>
    <h1>GSP</h1>
    <p>
      Below you can see a list of services that you can request the data
      insights for. Select the desired services from the list and submit the
      request.
    </p>
    <CategoryApiList/>
    <p>
      Lorem ipsum some fancy text....
    </p>
    <CategoryManualList/>
    <LogoutLink>Logout</LogoutLink>
  </Fragment>
);