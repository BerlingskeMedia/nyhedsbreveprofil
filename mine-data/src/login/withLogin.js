import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchUserInfo } from '../actions/userInfo';

const switcher = (LoginComponent, PendingComponent, LoggedComponent) => {
  const comp = ({userInfo, fetchUserInfo, ...rest}) => {
    if (userInfo.isPending) {
      return <PendingComponent {...rest}/>
    }

    if (userInfo.isFetched) {
      if (userInfo.userInfo) {
        return <LoggedComponent {...rest}/>
      }

      return <LoginComponent {...rest}/>
    }

    fetchUserInfo();
    return null;
  };

  comp.propTypes = {
    userInfo: PropTypes.any,
    fetchUserInfo: PropTypes.func
  };

  return comp;
};

const mapStateToProps = state => ({
  userInfo: state.userInfo
});

const mapDispatchToProps = dispatch => ({
  fetchUserInfo: () => dispatch(fetchUserInfo())
});

export const withUserData = (LoginComponent, PendingComponent, LoggedComponent) => {
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(switcher(LoginComponent, PendingComponent, LoggedComponent));
};
