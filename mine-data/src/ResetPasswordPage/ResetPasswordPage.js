import React from 'react';
import { ResetPasswordForm } from './ResetPasswordForm';
import { ChangePasswordForm } from './ChangePasswordForm';

export class ResetPasswordPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null
    };
  }

  componentWillMount() {
    const token = window.location.search.match(/pwrt=([^&]+)/i);

    if (token) {
      this.setState({token: token[1]});
    }
  }

  render() {
    const {token} = this.state;

    if (token) {
      return <ChangePasswordForm token={token}/>;
    }

    return <ResetPasswordForm/>;
  }
}
