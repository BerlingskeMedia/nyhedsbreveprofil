import React from 'react';

export const withTitle = (WrapperComponent) => {
  return (props) => (
    <WrapperComponent {...props} title={props.category.name}/>
  );
};