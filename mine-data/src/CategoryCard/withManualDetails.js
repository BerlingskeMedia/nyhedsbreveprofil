import React, { Fragment } from 'react';

export const withManualDetails = (WrapperComponent) => {
  return (props) => (
    <WrapperComponent {...props} details={(category => (
      <Fragment>
        <strong>Hvilke oplysninger?</strong>
        <p>{category.informationType}</p>
        <strong>Hvad er formålet med databehandlingen?</strong>
        <p>{category.purpose}</p>
        <strong>Hvad er lovhjemlen for databehandlingen?</strong>
        <p>{category.authority}</p>
        <strong>Hvem har adgang til data?</strong>
        <p>{category.access}</p>
        <strong>Hvor kommer data fra?</strong>
        <p>{category.origin}</p>
        <strong>Hvem er registreret?</strong>
        <p>{category.registrer}</p>
        <strong>Hvor længe opbevares data?</strong>
        <p>{category.storeLongevity}</p>
      </Fragment>
    ))}/>
  );
};

