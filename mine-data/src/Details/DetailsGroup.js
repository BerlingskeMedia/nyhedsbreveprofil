import React from 'react';
import PropTypes from 'prop-types';
import SubmitButton from '../SubmitButton/SubmitButton';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

import './DetailsGroup.scss';

export class DetailsGroup extends React.Component {
  constructor(props) {
    super(props);

    this.cancel = this.cancel.bind(this);
    this.confirm = this.confirm.bind(this);
    this.showConfirmation = this.showConfirmation.bind(this);

    this.state = {
      isOpen: false,
      pending: false
    };
  }

  cancel() {
    this.setState({
      isOpen: false
    });
  }

  confirm() {
    this.setState({
      pending: true
    });

    this.props.deleteAction()
      .catch(() => {
        this.setState({
          pending: false
        });
      });
  }

  showConfirmation() {
    this.setState({
      isOpen: true
    });
  }

  render() {
    return (
      <div className="DetailsGroup">
        <div className="DetailsGroup-content">
          {this.props.children}
        </div>
        {this.props.deleteAction ? (
          <div className="DetailsGroup-action">
            <SubmitButton onClick={this.showConfirmation}>Slet</SubmitButton>
            <Modal centered isOpen={this.state.isOpen} toggle={this.cancel}>
              <ModalBody>Are you sure?</ModalBody>
              <ModalFooter>
                <SubmitButton onClick={this.confirm} loading={this.state.pending}>OK</SubmitButton>
                <SubmitButton color="link" onClick={this.cancel}>Cancel</SubmitButton>
              </ModalFooter>
            </Modal>
          </div>
        ) : null}
      </div>
    );
  }
}

DetailsGroup.propTypes = {
  deleteAction: PropTypes.func
};