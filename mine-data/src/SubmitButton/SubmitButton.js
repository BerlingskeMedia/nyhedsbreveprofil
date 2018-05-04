import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import classNames from 'classnames';

import './SubmitButton.scss';
import { Loading } from '../Loading/Loading';

const SubmitButton = ({className, children, loading, disabled, warn, ...rest}) => (
  <Button {...rest} type="submit"
          className={classNames(className, 'SubmitButton', {loading, warn})}
          disabled={loading || disabled}>
    <div className="loader">
      <Loading/>
    </div>
    <div className="content">
      {children}
    </div>
  </Button>
);

SubmitButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  warn: PropTypes.bool,
  onClick: PropTypes.func
};

SubmitButton.defaultProps = {
  className: '',
  disabled: false,
  loading: false,
  onClick: () => {}
};

export default SubmitButton;