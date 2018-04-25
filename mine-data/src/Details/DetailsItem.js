import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const DetailsItem = ({value, children, className}) => {
  if (value) {
    return (
      <div className={classNames('DetailsItem', className)}>
        <strong>{children}: </strong>
        {value}
      </div>
    );
  }

  return null;
};

DetailsItem.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string
};