import React from 'react';
import PropTypes from 'prop-types';
import { FormInput } from '../Form/FormInput';
import { Link } from 'react-router-dom';
import SubmitButton from '../SubmitButton/SubmitButton';
import { connect } from 'react-redux';
import { fetchChangePassword, resetChangePassword } from './changePassword.actions';
import { logOut } from '../logout/logOut.actions';

export class ChangePasswordFormDisconnected extends React.Component {
  constructor(props) {
    super(props);

    this.fetchChangePassword = this.fetchChangePassword.bind(this);
    this.setNewPassword = this.setNewPassword.bind(this);

    this.state = {
      newPassword: ''
    };
  }

  componentWillUnmount() {
    this.props.resetChangePassword();
  }

  fetchChangePassword(e) {
    e.preventDefault();
    this.props.logOut();
    this.props.fetchChangePassword(this.state.newPassword, this.props.token);
  }

  setNewPassword(e) {
    this.setState({
      newPassword: e.target.value
    });
  }

  render() {
    const {pending, fetched, response} = this.props;
    const {newPassword} = this.state;

    if (!fetched) {
      return (
        <form className="form" onSubmit={this.fetchChangePassword}
              autoComplete="off">
          <div className="row justify-content-center">
            <div className="col-sm-6">
              <p>You have requested a password reset:</p>
            </div>
          </div>
          <FormInput name="password" type="password" label="Ny kodeord"
                     value={newPassword} pending={pending}
                     onChange={this.setNewPassword}/>
          <div className="row justify-content-center">
            <div className="col-sm-6 nav-buttons">
              <Link to="/mine-data">Annullér</Link>
              <SubmitButton
                loading={pending}>Submit</SubmitButton>
            </div>
          </div>
          {response ?
            <div className="row justify-content-center">
              <div
                className="col-sm-6 form-error">{response.errorDetails}</div>
            </div> : null}
        </form>
      );
    }

    return (
      <p>
        Your password has been changed.
        <br/>
        <br/>
        You can <Link to="/mine-data">login</Link> now.
      </p>
    );
  }
}

const mapStateToProps = ({changePasswordForm: {pending, fetched, response}}) => ({
  pending,
  fetched,
  response
});

const mapDispatchToProps = dispatch => ({
  fetchChangePassword: (password, token) => dispatch(fetchChangePassword(password, token)),
  resetChangePassword: () => dispatch(resetChangePassword()),
  logOut: () => dispatch(logOut())
});

export const ChangePasswordForm = connect(mapStateToProps, mapDispatchToProps)(ChangePasswordFormDisconnected);

ChangePasswordForm.propTypes = {
  token: PropTypes.string
};