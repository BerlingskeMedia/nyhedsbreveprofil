import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import classNames from 'classnames';

import './SubmitButton.scss';

const SubmitButton = ({children, loading, disabled}) => (
  <Button type="submit" className={classNames('SubmitButton', {loading})}
          disabled={loading || disabled}>
    <div className="content">
      {children}
    </div>
  </Button>
);

SubmitButton.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool
};

SubmitButton.defaultProps = {
  disabled: false,
  loading: false
};

export default SubmitButton;