import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { login, resetLogin, setPassword, setUsername } from './login.actions';
import SubmitButton from '../SubmitButton/SubmitButton';
import { Link } from 'react-router-dom';
import { FormInput } from '../Form/FormInput';

export class LoginDisconnected extends React.Component {
  constructor(props) {
    super(props);
    this.setPassword = this.setPassword.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillUnmount() {
    this.props.resetLogin();
  }

  setPassword(e) {
    this.props.setPassword(e.target.value);
  }

  setUsername(e) {
    this.props.setUsername(e.target.value);
  }

  submit(e) {
    e.preventDefault();

    this.props.login({
      username: this.props.username,
      password: this.props.password
    });
  }

  render() {
    return (
      <form className="form" onSubmit={this.submit} autoComplete="off">
        <FormInput name="email" type="email" label="E-mailadresse"
                   value={this.props.username} pending={this.props.pending}
                   onChange={this.setUsername}/>
        {/*<div className="row justify-content-center">*/}
          {/*<div className="col-sm-6">*/}
            {/*<FormGroup>*/}
              {/*<Label for="email" className="control-label LoginForm-label">E-mailadresse</Label>*/}
              {/*<Input type="email" id="email" name="email" autoComplete="off"*/}
                     {/*value={this.props.username} onChange={this.setUsername}*/}
                     {/*readOnly={this.props.pending}/>*/}
            {/*</FormGroup>*/}
          {/*</div>*/}
        {/*</div>*/}
        <FormInput name="password" type="password" value={this.props.password}
                   onChange={this.setPassword} pending={this.props.pending}
                   autoComplete="off"/>
        {/*<div className="row justify-content-center">*/}
          {/*<div className="col-sm-6">*/}
            {/*<FormGroup>*/}
              {/*<Label className="control-label LoginForm-label">Adgangskode</Label>*/}
              {/*<Input type="password" id="password" name="password" autoComplete="off"*/}
                     {/*value={this.props.password} onChange={this.setPassword}*/}
                     {/*readOnly={this.props.pending} />*/}
            {/*</FormGroup>*/}
          {/*</div>*/}
        {/*</div>*/}
        <div className="row justify-content-center">
          <div className="col-sm-6 nav-buttons">
            <Link to="/mine-data/register">Opret konto</Link>
            <SubmitButton loading={this.props.pending}>Log ind</SubmitButton>
          </div>
        </div>
        {this.props.response ? <div className="row justify-content-center">
          <div className="col-sm-6 form-error">{this.props.response.errorDetails}</div>
        </div> : null}
      </form>
    );
  }
}

const mapStateToProps = ({login}) => ({
  pending: login.pending,
  response: login.response,
  username: login.username,
  password: login.password
});

const mapDispatchToProps = (dispatch) => ({
  login: (payload) => dispatch(login(payload)),
  setUsername: (username) => dispatch(setUsername(username)),
  setPassword: (password) => dispatch(setPassword(password)),
  resetLogin: () => dispatch(resetLogin())
});

export const LoginForm = connect(mapStateToProps, mapDispatchToProps)(LoginDisconnected);
