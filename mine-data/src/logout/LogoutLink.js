import React from 'react';
import { connect } from 'react-redux';
import { logOut } from './logOut.actions';

import './LogoutLink.scss';

const StaticLogoutLink = ({children, onClick}) => (
  <a className="LogoutLink" onClick={onClick}>{children}</a>
);

const mapDispatchToProps = (dispatch) => ({
  onClick: () => dispatch(logOut())
});

export const LogoutLink = connect(null, mapDispatchToProps)(StaticLogoutLink);