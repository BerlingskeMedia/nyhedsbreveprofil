import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchUserInfo } from '../actions/userInfo';

const switcher = (LoginComponent, PendingComponent, LoggedComponent) => {
  class comp extends React.Component {
    componentWillMount() {
      this.fetchUserIfNeeded(this.props);
    }

    componentWillReceiveProps(props) {
      this.fetchUserIfNeeded(props);
    }

    fetchUserIfNeeded({userInfo: {isPending, isFetched}, fetchUserInfo}) {
      if (!isPending && !isFetched) {
        fetchUserInfo();
      }
    }

    render() {
      const {userInfo, ...rest} = this.props;

      if (userInfo.isPending) {
        return <PendingComponent {...rest}/>
      }

      if (userInfo.isFetched) {
        if (userInfo.userInfo && !userInfo.userInfo.errorCode) {
          return <LoggedComponent {...rest}/>
        }

        return <LoginComponent {...rest}/>
      }

      return null;
    }
  }

  comp.propTypes = {
    userInfo: PropTypes.any,
    fetchUserInfo: PropTypes.func
  };

  return comp;
};

const mapStateToProps = ({userInfo}) => ({
  userInfo
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
