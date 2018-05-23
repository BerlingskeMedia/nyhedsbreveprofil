import React, {Fragment} from 'react';
import SubmitButton from '../SubmitButton/SubmitButton';
import {Modal, ModalBody, ModalFooter} from "reactstrap";

export class VerifyPending extends React.Component {

  constructor(props) {
    super(props);
    this.state = {sent: false};
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

    this.setState({sent: true});
  }

  render() {
    return (
      <Fragment>
        <h1>Verserende E-mail bekræftelse</h1>
        <p>
          For din sikkerhed er der sendt en verifikations-email til dig.<br/>
          Følg instruktionerne i e-mailen for at bekræfte din konto.
          <br/>For at sende bekræftelses-e-mailen igen, skal du klikke på Send.
          <SubmitButton onClick={this.submit}>Send</SubmitButton>
        </p>
        <Modal isOpen={this.state.sent} toggle={this.redirect}>
          <ModalBody>En bekræftelses email med et link til at bekræfte din konto er blevet sendt til dig.</ModalBody>
          <ModalFooter>
            <SubmitButton onClick={this.redirect}>OK</SubmitButton>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}
