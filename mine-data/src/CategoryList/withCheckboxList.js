import React from 'react';

export const withCheckboxList = (WrapperComponent) => {
  return ({onCheck, isChecked, children, ...otherProps}) => (
    <WrapperComponent {...otherProps}>
      {React.Children.map(children, element => React.cloneElement(element, {
        ...element.props,
        onCheck: () => onCheck(element.props.category),
        checked: isChecked(element.props.category)
      }))}
    </WrapperComponent>
  );
};