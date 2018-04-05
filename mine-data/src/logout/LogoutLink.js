import React from 'react';
import { connect } from 'react-redux';
import { logOut } from '../actions/logOut';

const StaticLogoutLink = ({children, onClick}) => (
  <a onClick={onClick}>{children}</a>
);

const mapDispatchToProps = (dispatch) => ({
  onClick: () => dispatch(logOut())
});

export const LogoutLink = connect(null, mapDispatchToProps)(StaticLogoutLink);