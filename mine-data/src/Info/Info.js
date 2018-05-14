import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';

import './Info.scss';

export class Info extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const {children, id} = this.props;
    const {isOpen} = this.state;

    return (
      <Fragment>
        <div className="Info" id={`Info-trigger-${id}`}>i</div>
        <Tooltip placement="left" isOpen={isOpen} toggle={this.toggle}
                 target={`Info-trigger-${id}`}>{children}</Tooltip>
      </Fragment>
    );
  }
}

Info.propTypes = {
  id: PropTypes.string.isRequired
};