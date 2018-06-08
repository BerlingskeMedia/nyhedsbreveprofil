import React, {Component, Fragment} from 'react';
import SubmitButton from '../SubmitButton/SubmitButton';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { cancelConfirm, reset, showConfirm, submit } from './deleteAll.actions';

export class DeleteAllDisconnected extends Component {
  render() {
    const {kundeunivers, deleteAll, showConfirm, resetRequest, cancelConfirm, submit} = this.props;
    const disableButton = !kundeunivers.data || kundeunivers.data.orders.some(order => order.active);

    return (
      <Fragment>
        <div className="nav-buttons justify-content-end mt-5">
          <SubmitButton color="danger" disabled={disableButton} onClick={showConfirm}>Slet min bruger</SubmitButton>
        </div>
        <Modal centered isOpen={deleteAll.confirm} toggle={cancelConfirm}>
          <ModalHeader>ADVARSEL!</ModalHeader>
          <ModalBody>
            <p>
              Lorem ipsum... are you sure?
            </p>
          </ModalBody>
          <ModalFooter>
            <SubmitButton loading={deleteAll.request.pending} onClick={submit}>Bekræft</SubmitButton>
            <SubmitButton color="link" onClick={cancelConfirm}>Afbryd</SubmitButton>
          </ModalFooter>
        </Modal>
        <Modal centered isOpen={deleteAll.request.fetched} toggle={resetRequest}>
          <ModalBody>
            <p>
              Lorem ipsum... deletion successful.
            </p>
          </ModalBody>
          <ModalFooter>
            <SubmitButton onClick={resetRequest}>OK</SubmitButton>
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
  showConfirm: () => dispatch(showConfirm()),
  cancelConfirm: () => dispatch(cancelConfirm())
});

export const DeleteAll = connect(mapStateToProps, mapDispatchToProps)(DeleteAllDisconnected);