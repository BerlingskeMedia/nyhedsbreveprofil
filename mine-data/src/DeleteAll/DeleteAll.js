import React, {Component, Fragment} from 'react';
import SubmitButton from '../SubmitButton/SubmitButton';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { cancelConfirm, reset, showConfirm, submit } from './deleteAll.actions';

export class DeleteAllDisconnected extends Component {
  render() {
    const {deleteAll, showConfirm, resetRequest, cancelConfirm, submit} = this.props;

    return (
      <Fragment>
        <div className="nav-buttons justify-content-end mt-5">
          <SubmitButton color="danger" onClick={showConfirm}>Slet min bruger</SubmitButton>
        </div>
        <Modal centered isOpen={deleteAll.confirm} toggle={cancelConfirm}>
          <ModalHeader>ADVARSEL!</ModalHeader>
          <ModalBody>
            <p>
              Lorem ipsum... are you sure?
            </p>
          </ModalBody>
          <ModalFooter>
            <SubmitButton loading={deleteAll.pending} onClick={submit}>Bekræft</SubmitButton>
            <SubmitButton color="link" onClick={cancelConfirm}>Afbryd</SubmitButton>
          </ModalFooter>
        </Modal>
        <Modal centered isOpen={deleteAll.fetched} toggle={resetRequest}>
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

const mapStateToProps = ({deleteAll, apiData}) => ({
  deleteAll,
  apiData
});

const mapDispatchToProps = dispatch => ({
  submit: () => dispatch(submit()),
  resetRequest: () => dispatch(reset()),
  showConfirm: () => dispatch(showConfirm()),
  cancelConfirm: () => dispatch(cancelConfirm())
});

export const DeleteAll = connect(mapStateToProps, mapDispatchToProps)(DeleteAllDisconnected);