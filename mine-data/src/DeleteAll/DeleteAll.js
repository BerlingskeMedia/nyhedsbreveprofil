import React, {Component, Fragment} from 'react';
import SubmitButton from '../SubmitButton/SubmitButton';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import {
  cancelConfirm, finalize, reset, showConfirm,
  submit
} from './deleteAll.actions';

import './DeleteAll.scss';

export class DeleteAllDisconnected extends Component {
  render() {
    const {kundeunivers, deleteAll, showConfirm, resetRequest, cancelConfirm, submit, finalizeRequest} = this.props;
    const disableButton = !kundeunivers.data || kundeunivers.data.orders.some(order => order.active);

    return (
      <Fragment>
        <div className="nav-buttons justify-content-end mt-5">
          {disableButton ? <div className="button-label text-lg-right">
            Sletning er ikke mulig, da du har aktive ordre, og vi dermed ikke kan slette din bruger.
          </div> : null}
          <SubmitButton color="danger" disabled={disableButton} onClick={showConfirm}>Slet al data inkl. denne profil*</SubmitButton>
        </div>
        <p className="DeleteAll-label">
          *Bemærk at at vi i særlige tilfælde beholder en historik i en tidsbegrænset periode pga. retlig forpligtelse til at gemme denne data. Formålet hermed er, at kunne dokumentere at vi har haft lovhjemmel til behandlingen, eller evt. senere sagsbehandling.
        </p>
        <Modal centered isOpen={deleteAll.confirm} toggle={cancelConfirm}>
          <ModalHeader>ADVARSEL!</ModalHeader>
          <ModalBody>
            <p>Er du sikker på at du ønsker at slette alle dine oplysninger?</p>
            <p>Bemærk at at vi i særlige tilfælde beholder en historik i en tidsbegrænset periode pga. retlig forpligtelse til at gemme denne data. Formålet hermed er, at kunne dokumentere at vi har haft lovhjemmel til behandlingen, eller evt. senere sagsbehandling. Data på tidligere samtykker til nyhedsbreve gemmes i 2 år. Oplysninger om abonnementer gemmes i 5 år.</p>
          </ModalBody>
          <ModalFooter>
            <SubmitButton loading={deleteAll.request.pending} onClick={submit}>Bekræft</SubmitButton>
            <SubmitButton color="link" onClick={cancelConfirm}>Afbryd</SubmitButton>
          </ModalFooter>
        </Modal>
        <Modal centered isOpen={deleteAll.request.fetched} toggle={resetRequest}>
          <ModalBody>
            <p>
              Tak for din henvendelse.
              <br/>Dine data er nu slettet, og du vil blive ledt tilbage til login siden.
            </p>
            <p>Bemærk at du ikke vil kunne logge ind herefter, da din bruger er slettet.</p>
            <p>Dele af dine data skal slettes manuelt. Dette modtager du bekræftelse på inden for 30 dage.</p>
          </ModalBody>
          <ModalFooter>
            <SubmitButton onClick={finalizeRequest}>OK</SubmitButton>
          </ModalFooter>
        </Modal>
        <Modal centered isOpen={!!deleteAll.request.error} toggle={resetRequest}>
          <ModalBody>
            <p>Der skete en fejl!</p>
            <p>Dele af dine data kan ikke bekræftes slettet.</p>
          </ModalBody>
          <ModalFooter>
            <SubmitButton loading={deleteAll.request.pending} onClick={submit}>Prøv igen</SubmitButton>
            <SubmitButton onClick={resetRequest} color="link">Afbryd</SubmitButton>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = ({deleteAll, apiData: {kundeunivers}}) => ({
  deleteAll,
  kundeunivers
});

const mapDispatchToProps = dispatch => ({
  submit: () => dispatch(submit()),
  resetRequest: () => dispatch(reset()),
  finalizeRequest: () => dispatch(finalize()),
  showConfirm: () => dispatch(showConfirm()),
  cancelConfirm: () => dispatch(cancelConfirm())
});

export const DeleteAll = connect(mapStateToProps, mapDispatchToProps)(DeleteAllDisconnected);