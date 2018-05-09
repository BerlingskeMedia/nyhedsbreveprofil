import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, Label } from 'reactstrap';

import './Form.scss';

export const FormInput = ({name, label = name, type = 'text', value, onChange, pending, ...otherProps}) => (
  <div className="row justify-content-center">
    <div className="col-sm-6">
      <FormGroup>
        <Label for={name} className="control-label FormInput-label">{label}</Label>
        <Input type={type} id={name} name={name} autoComplete="off"
               value={value} onChange={onChange}
               readOnly={pending} {...otherProps}/>
      </FormGroup>
    </div>
  </div>
);

FormInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  pending: PropTypes.bool
};