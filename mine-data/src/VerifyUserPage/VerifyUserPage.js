import React from 'react';
import { FormGroup, Input } from 'reactstrap';
import SubmitButton from '../SubmitButton/SubmitButton';
import { connect } from 'react-redux';
import { fetchVerifyUser, setPassword } from './verifyUser.actions';
import { LogoutLink } from '../logout/LogoutLink';

class VerifyUser extends React.Component {
  constructor(props) {
    super(props);

    this.setPassword = this.setPassword.bind(this);
    this.submit = this.submit.bind(this);
  }

  setPassword(e) {
    this.props.setPassword(e.target.value);
  }

  submit(e) {
    e.preventDefault();

    this.props.verifyUser(this.props.password)
  }

  render() {
    return (
      <form className="form" onSubmit={this.submit} autoComplete="off">
        <div className="row justify-content-center">
          <div className="col-sm-9">
            <div className="form-group">Du er logget ind som:</div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-sm-6 form-group"><strong>{this.props.username}</strong></div>
          <Input className="d-none" type="email" id="email" name="email"
                 autoComplete="off" value={this.props.username} readOnly/>
        </div>
        <div className="row justify-content-center">
          <div className="col-sm-9 form-group font-italic">
            Ikke dig? <LogoutLink>Log ind med en anden konto.</LogoutLink>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-sm-9">
            <div className="form-group">Bekræft din adgangskode for at logge ind</div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-sm-6">
            <FormGroup>
              <Input type="password" id="password" name="password" autoComplete="off"
                     value={this.props.password} onChange={this.setPassword}
                     readOnly={this.props.isPending} placeholder="kodeord" />
            </FormGroup>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-sm-6 nav-buttons">
            <SubmitButton loading={this.props.isPending}>Log ind</SubmitButton>
          </div>
        </div>
        {this.props.response ? <div className="row justify-content-center">
          <div className="col-sm-6 form-error">{this.props.response.errorDetails}</div>
        </div> : null}
      </form>
    );
  };
}

const mapStateToProps = ({userInfo, verifyUser}) => ({
  username: userInfo.userInfo && userInfo.userInfo.profile.email,
  ...verifyUser
});

const mapDispatchToProps = (dispatch) => ({
  setPassword: (password) => dispatch(setPassword(password)),
  verifyUser: (password) => dispatch(fetchVerifyUser(password))
});

export const VerifyUserPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyUser);