import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const DetailsItem = ({value, label, className, allowEmpty}) => {
  if (value || allowEmpty) {
    return (
      <div className={classNames('DetailsItem', className)}>
        <strong>{label}: </strong>
        <span dangerouslySetInnerHTML={{ __html: value}}/>
      </div>
    );
  }

  return null;
};

DetailsItem.propTypes = {
  value: PropTypes.any,
  className: PropTypes.string,
  allowEmpty: PropTypes.bool
};