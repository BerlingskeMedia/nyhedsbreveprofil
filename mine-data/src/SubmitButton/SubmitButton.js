import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import classNames from 'classnames';

import './SubmitButton.scss';

const SubmitButton = ({children, loading}) => (
  <Button type="submit" className={classNames('SubmitButton', {loading})}
          disabled={loading}>
    <div className="content">
      {children}
    </div>
  </Button>
);

SubmitButton.propTypes = {
  loading: PropTypes.bool
};

SubmitButton.defaultProps = {
  loading: false
};

export default SubmitButton;