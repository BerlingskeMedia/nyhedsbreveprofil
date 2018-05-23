import React from 'react';
import {connect} from 'react-redux';
import {login, resetLogin, setPassword, setUsername} from './login.actions';
import SubmitButton from '../SubmitButton/SubmitButton';
import {Link} from 'react-router-dom';
import {FormInput} from '../Form/FormInput';
import {LogoutLink} from '../logout/LogoutLink';
import {
  fetchVerifyUser,
  resetVerifyUser
} from '../VerifyUserPage/verifyUser.actions';
import {Modal, ModalBody, ModalFooter} from "reactstrap";

export class LoginDisconnected extends React.Component {
  constructor(props) {
    super(props);
    this.setPassword = this.setPassword.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.submit = this.submit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.submitModal = this.submitModal.bind(this);
    this.state = {showModal: false}
  }

  componentWillMount() {
    if (this.props.userInfo.userInfo && this.props.userInfo.userInfo.profile) {
      this.props.setUsername(this.props.userInfo.userInfo.profile.email);
    }
  }

  componentWillUnmount() {
    this.props.resetLogin();
    this.props.resetVerifyUser();
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
      }).then(response => {
        if (response && response.errorCode === 206002) {
          this.setState({showModal: true});
        }
      });
    }
  }

  submitModal() {
    gigya.accounts.resendVerificationCode({
      regToken: this.props.response.regToken,
      email: this.props.username
    });
    this.toggleModal();
  }

  toggleModal() {
    this.setState({ showModal: false });
  }

  render() {
    const {userInfo, username, pending, password, response, verifyUser} = this.props;
    const isPending = pending || verifyUser.isPending;
    const isLoggedIn = !!userInfo.userInfo && !!userInfo.userInfo.profile;
    const isMailPending = response && response.errorCode === 206002;

    return (
      <form className="form" onSubmit={this.submit} autoComplete="off">
        <FormInput name="email" type="email" label="E-mailadresse"
                   value={username} pending={pending}
                   onChange={this.setUsername} readOnly={isLoggedIn}
                   hint={isLoggedIn ?
                     <div>Ikke dig? <LogoutLink>Log ind med en anden konto.</LogoutLink></div> : null}/>
        <FormInput name="password" type="password" value={password}
                   onChange={this.setPassword} pending={isPending}
                   autoComplete="off"
                   hint={<Link to="/mine-data/reset-password" className="text-secondary">Forgot password?</Link>}/>
        <div className="row justify-content-center">
          <div className="col-sm-6 nav-buttons">
            <Link to="/mine-data/register">Opret konto</Link>
            <SubmitButton loading={isPending}>Log ind</SubmitButton>
          </div>
        </div>
        {response && !isMailPending ? <div className="row justify-content-center">
            <div className="col-sm-6 form-error">{this.translateError(response)}</div>
        </div> : null}
        <Modal isOpen={this.state.showModal} toggle={this.toggleModal}>
          <ModalBody>
            For din sikkerhed er der sendt en verifikations-email til dig.<br/>
            Følg instruktionerne i e-mailen for at bekræfte din konto.<br/>
            <strong>For at sende bekræftelses-e-mailen igen, skal du klikke på Send.</strong>
          </ModalBody>
          <ModalFooter>
            <SubmitButton onClick={this.submitModal}>Send</SubmitButton>
            <SubmitButton color="link" onClick={this.toggleModal}>Close</SubmitButton>
          </ModalFooter>
        </Modal>
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
  fetchVerifyUser: (password) => dispatch(fetchVerifyUser(password)),
  resetVerifyUser: () => dispatch(resetVerifyUser())
});

export const LoginForm = connect(mapStateToProps, mapDispatchToProps)(LoginDisconnected);
