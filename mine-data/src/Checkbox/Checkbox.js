import React from 'react';
import PropTypes from 'prop-types';

import './Checkbox.scss'
import { Input } from 'reactstrap';

const Checkbox = ({checked, onChange, disabled}) => (
  <div className="Checkbox">
    <Input type="checkbox" checked={checked} onChange={onChange} disabled={disabled}/>
    <div className="fake-input"/>
  </div>
);

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool
};

Checkbox.defaultProps = {
  disabled: false
};

export default Checkbox;