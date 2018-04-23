import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../Checkbox/Checkbox';

export const withCheckbox = (WrapperCategoryCard) => {
  const Wrapped = ({onCheck, checked, ...otherProps}) => (
    <WrapperCategoryCard {...otherProps} sideNav={() => {
      return <Checkbox checked={checked} onChange={() => onCheck(otherProps.category)}/>;
    }}/>
  );

  Wrapped.propTypes = {
    ...WrapperCategoryCard.propTypes,
    onCheck: PropTypes.func,
    checked: PropTypes.bool
  };

  return Wrapped;
};