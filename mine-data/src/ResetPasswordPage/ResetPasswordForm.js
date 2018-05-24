import React from 'react';
import { FormInput } from '../Form/FormInput';
import { Link } from 'react-router-dom';
import SubmitButton from '../SubmitButton/SubmitButton';
import { connect } from 'react-redux';
import { fetchResetPassword, resetResetPassword } from './resetPassword.actions';
import { logOut } from '../logout/logOut.actions';

export class ResetPasswordFormDisconnected extends React.Component {
  constructor(props) {
    super(props);

    this.setEmail = this.setEmail.bind(this);
    this.submit = this.submit.bind(this);

    this.state = {
      email: ''
    };
  }

  componentWillUnmount() {
    this.props.resetResetPassword();
  }

  setEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  submit(e) {
    e.preventDefault();
    this.props.logOut();
    this.props.fetchResetPassword(this.state.email);
  }

  render() {
    const {pending, fetched} = this.props;
    const {email} = this.state;

    if (!fetched) {
      return (
        <form className="form" onSubmit={this.submit} autoComplete="off">
          <div className="row justify-content-center">
            <div className="col-sm-6">
              <p>Reset password:</p>
            </div>
          </div>
          <FormInput name="email" type="email" label="E-mailadresse"
                     value={email} pending={pending}
                     onChange={this.setEmail}/>
          <div className="row justify-content-center">
            <div className="col-sm-6 nav-buttons">
              <Link to="/mine-data">Tilbage</Link>
              <SubmitButton loading={pending}>Nulstil</SubmitButton>
            </div>
          </div>
        </form>
      );
    }

    return (
      <p>
        Thank you for your request.
        <br/>
        <br/>
        If there is an account assigned to this email address, you'll receive a link to reset your password.
        <br/>
        <br/>
        <Link to="/mine-data">Tilbage</Link>
      </p>
    );
  }
}

const mapStateToProps = ({resetPasswordForm: {pending, fetched}}) => ({
  pending,
  fetched
});

const mapDispatchToProps = dispatch => ({
  fetchResetPassword: email => dispatch(fetchResetPassword(email)),
  resetResetPassword: () => dispatch(resetResetPassword()),
  logOut: () => dispatch(logOut())
});

export const ResetPasswordForm = connect(mapStateToProps, mapDispatchToProps)(ResetPasswordFormDisconnected);
