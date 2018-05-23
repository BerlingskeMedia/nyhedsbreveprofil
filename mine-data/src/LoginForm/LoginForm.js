import React from 'react';
import { connect } from 'react-redux';
import { login, resetLogin, setPassword, setUsername } from './login.actions';
import SubmitButton from '../SubmitButton/SubmitButton';
import { Link } from 'react-router-dom';
import { FormInput } from '../Form/FormInput';
import { LogoutLink } from '../logout/LogoutLink';
import { fetchVerifyUser } from '../VerifyUserPage/verifyUser.actions';

export class LoginDisconnected extends React.Component {
  constructor(props) {
    super(props);
    this.setPassword = this.setPassword.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    if (this.props.userInfo.userInfo && this.props.userInfo.userInfo.profile) {
      this.props.setUsername(this.props.userInfo.userInfo.profile.email);
    }
  }

  componentWillUnmount() {
    this.props.resetLogin();
  }

  translateError(errorResponse) {
    if (errorResponse.errorCode === 403042) {
      return 'Forkert kodeord eller bruger';
    }

    return errorResponse.errorDetails;
  }

  setPassword(e) {
    this.props.setPassword(e.target.value);
  }

  setUsername(e) {
    this.props.setUsername(e.target.value);
  }

  submit(e) {
    e.preventDefault();

    if (this.props.userInfo.userInfo && this.props.userInfo.userInfo.profile) {
      this.props.fetchVerifyUser(this.props.password);
    } else {
      this.props.login({
        username: this.props.username,
        password: this.props.password
      });
    }
  }

  render() {
    const {userInfo, username, pending, password, response, verifyUser} = this.props;
    const isPending = pending || verifyUser.isPending;
    const isLoggedIn = !!userInfo.userInfo && !!userInfo.userInfo.profile;

    if (response) console.log(response);

    return (
      <form className="form" onSubmit={this.submit} autoComplete="off">
        <FormInput name="email" type="email" label="E-mailadresse"
                   value={username} pending={pending}
                   onChange={this.setUsername} readOnly={isLoggedIn}
                   hint={isLoggedIn ? <div>Ikke dig? <LogoutLink>Log ind med en anden konto.</LogoutLink></div> : null}/>
        <FormInput name="password" type="password" value={password}
                   onChange={this.setPassword} pending={isPending}
                   autoComplete="off"/>
        <div className="row justify-content-center">
          <div className="col-sm-6 nav-buttons">
            <Link to="/mine-data/register">Opret konto</Link>
            <SubmitButton loading={isPending}>Log ind</SubmitButton>
          </div>
        </div>
        {response ? <div className="row justify-content-center">
          <div className="col-sm-6 form-error">{this.translateError(response)}</div>
        </div> : null}
        {verifyUser.response ? <div className="row justify-content-center">
          <div className="col-sm-6 form-error">{this.translateError(verifyUser.response)}</div>
        </div> : null}
      </form>
    );
  }
}

const mapStateToProps = ({login, userInfo, verifyUser}) => ({
  pending: login.pending,
  response: login.response,
  username: login.username,
  password: login.password,
  userInfo,
  verifyUser
});

const mapDispatchToProps = (dispatch) => ({
  login: (payload) => dispatch(login(payload)),
  setUsername: (username) => dispatch(setUsername(username)),
  setPassword: (password) => dispatch(setPassword(password)),
  resetLogin: () => dispatch(resetLogin()),
  fetchVerifyUser: (password) => dispatch(fetchVerifyUser(password))
});

export const LoginForm = connect(mapStateToProps, mapDispatchToProps)(LoginDisconnected);
