import React, { Fragment } from 'react';
import { CategoryManualList } from '../CategoryManualList/CategoryManualList';
import { LogoutLink } from '../logout/LogoutLink';
import { UserDetails } from '../UserDetails/UserDetails';

export const HomePage = () => (
  <Fragment>
    <h1>GSP</h1>
    <UserDetails/>
    <CategoryManualList/>
    <LogoutLink>Logout</LogoutLink>
  </Fragment>
);