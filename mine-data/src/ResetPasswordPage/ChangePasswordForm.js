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
    this.setNewPasswordConfirm = this.setNewPasswordConfirm.bind(this);

    this.state = {
      newPassword: '',
      newPasswordConfirm: '',
      error: ''
    };
  }

  componentWillUnmount() {
    this.props.resetChangePassword();
  }

  fetchChangePassword(e) {
    e.preventDefault();

    if (this.state.newPassword !== this.state.newPasswordConfirm) {
      this.setState({
        error: 'Kodeordet skal være ens i begge felter'
      });
    } else {
      this.props.logOut();
      this.props.fetchChangePassword(this.state.newPassword, this.props.token);
      this.setState({
        error: ''
      });
    }
  }

  setNewPassword(e) {
    this.setState({
      newPassword: e.target.value
    });
  }

  setNewPasswordConfirm(e) {
    this.setState({
      newPasswordConfirm: e.target.value
    });
  }

  render() {
    const {pending, fetched, response} = this.props;
    const {newPassword, newPasswordConfirm, error} = this.state;

    if (!fetched) {
      return (
        <form className="form" onSubmit={this.fetchChangePassword}
              autoComplete="off">
          <div className="row justify-content-center">
            <div className="col-sm-6">
              <p>You have requested a password reset:</p>
            </div>
          </div>
          <FormInput name="password" type="password" label="Ny adgangskode"
                     value={newPassword} pending={pending}
                     onChange={this.setNewPassword}/>
          <FormInput name="password-confirm" type="password" label="Gentag ny adgangskode"
                     value={newPasswordConfirm} pending={pending}
                     onChange={this.setNewPasswordConfirm}/>
          <div className="row justify-content-center">
            <div className="col-sm-6 nav-buttons">
              <Link to="/mine-data">Annullér</Link>
              <SubmitButton
                loading={pending}>Nulstil</SubmitButton>
            </div>
          </div>
          {error ?
            <div className="row justify-content-center">
              <div className="col-sm-6 form-error">{error}</div>
            </div> : null}
          {response ?
            <div className="row justify-content-center">
              <div className="col-sm-6 form-error">{response.errorDetails}</div>
            </div> : null}
        </form>
      );
    }

    return (
      <p>
        Din adgangskode er ændret.
        <br/>
        <br/>
        Du kan <Link to="/mine-data">logge ind</Link> nu.
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