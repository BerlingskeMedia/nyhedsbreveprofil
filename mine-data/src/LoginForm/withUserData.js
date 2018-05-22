import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchUserInfo } from '../common/userInfo.actions';
import { HomePage } from '../HomePage/HomePage';
import { LoginPage } from '../LoginPage/LoginPage';

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
    const {userInfo} = this.props;

    if (userInfo.isPending) {
      return <div>Loading...</div>;
    }

    if (userInfo.isFetched) {
      if (userInfo.userInfo && !userInfo.userInfo.errorCode) {
        if (userInfo.isVerified) {
          return <HomePage/>;
        }
      }

      return <LoginPage/>;
    }

    return null;
  }
}

LoadingSwitcher.propTypes = {
  userInfo: PropTypes.any,
  fetchUserInfo: PropTypes.func
};

const mapStateToProps = ({userInfo}) => ({
  userInfo
});

const mapDispatchToProps = dispatch => ({
  fetchUserInfo: () => dispatch(fetchUserInfo())
});

export const WithUserData = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadingSwitcher);
