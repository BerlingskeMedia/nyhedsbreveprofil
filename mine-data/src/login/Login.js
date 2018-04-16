import React from 'react';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { connect } from 'react-redux';
import {
  login, setPassword, setRememberMe, setUsername
} from './login.actions';

export class LoginDisconnected extends React.Component {
  constructor(props) {
    super(props);
    this.setPassword = this.setPassword.bind(this);
    this.setRememberMe = this.setRememberMe.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.submit = this.submit.bind(this);
  }

  setPassword(e) {
    this.props.setPassword(e.target.value);
  }

  setUsername(e) {
    this.props.setUsername(e.target.value);
  }

  submit() {
    this.props.login({
      username: this.props.username,
      password: this.props.password,
      rememberMe: this.props.rememberMe
    });
  }

  setRememberMe() {
    this.props.setRememberMe(this.props.rememberMe);
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <h3>Login</h3>
        </div>
        <div className="row justify-content-center">
          <div className="col-sm-4">
            <FormGroup>
              <Label for="email">email</Label>
              <Input type="email" id="email" name="email" value={this.props.username} onChange={this.setUsername} readOnly={this.props.pending}/>
            </FormGroup>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-sm-4">
            <FormGroup>
              <Label>password</Label>
              <Input type="password" id="password" name="password" value={this.props.password} onChange={this.setPassword} readOnly={this.props.pending}/>
            </FormGroup>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-sm4">
            <FormGroup check>
              <Label check>
                <Input type="checkbox" value={this.props.rememberMe} onChange={this.setRememberMe} readOnly={this.props.pending}/>
                remember me
              </Label>
            </FormGroup>
          </div>
        </div>
        <div className="row justify-content-center">
          <Button onClick={this.submit} disabled={this.props.pending}>Login</Button>
        </div>
        {this.props.response ? <div className="row justify-content-center">
          {this.props.response.errorDetails}
        </div> : null}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  login: (payload) => dispatch(login(payload)),
  setUsername: (username) => dispatch(setUsername(username)),
  setPassword: (password) => dispatch(setPassword(password)),
  setRememberMe: (rememberMe) => dispatch(setRememberMe(rememberMe)),
});

const mapStateToProps = ({login}) => ({
  pending: login.pending,
  rememberMe: login.rememberMe,
  response: login.response,
  username: login.username,
  password: login.password
});

export const Login = connect(mapStateToProps, mapDispatchToProps)(LoginDisconnected);