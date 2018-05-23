import React, {Fragment} from 'react';
import SubmitButton from '../SubmitButton/SubmitButton';

export class VerifyPending extends React.Component {

  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  componentWillMount() {
    if (this.props.location.state && !this.props.location.state.username) {
      this.redirect();
    }
  }

  redirect() {
    this.props.history.push('/mine-data')
  }

  submit() {
    gigya.accounts.resendVerificationCode({
      regToken: this.props.location.state.regToken,
      email: this.props.location.state.username
    });
  }

  render() {
    return (
      <Fragment>
        <h1>Verserende E-mail bekræftelse</h1>
        <p>
          For din sikkerhed er der sendt en verifikations-email til dig.<br/>
          Følg instruktionerne i e-mailen for at bekræfte din konto.
          <br/>
          <SubmitButton onClick={this.submit}>Home</SubmitButton>
        </p>
      </Fragment>
    );
  }
}
