import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchUserInfo } from '../common/userInfo.actions';

const switcher = (LoginComponent, PendingComponent, LoggedComponent) => {
  class LoadingSwitcher extends React.Component {
    componentWillMount() {
      LoadingSwitcher.fetchUserIfNeeded(this.props);
    }

    componentWillReceiveProps(props) {
      LoadingSwitcher.fetchUserIfNeeded(props);
    }

    static fetchUserIfNeeded({userInfo: {isPending, isFetched}, fetchUserInfo}) {
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

  LoadingSwitcher.propTypes = {
    userInfo: PropTypes.any,
    fetchUserInfo: PropTypes.func
  };

  return LoadingSwitcher;
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
