import React, { Fragment } from 'react';
import { CategoryManualList } from '../CategoryManualList/CategoryManualList';
import { LogoutLink } from '../logout/LogoutLink';
import { CategoryApiList } from '../CategoryApiList/CategoryApiList';

export const HomePage = () => (
  <Fragment>
    <div className="d-flex justify-content-between">
      <h1>Dine persondata hos Berlingske Media</h1>
      <LogoutLink>Logout</LogoutLink>
    </div>
    <p>
      Vi kan kun finde frem til dine data på baggrund af de oplysninger vi har på dig. Dem kan du se herunder. Hvis du ønsker at tilføje yderligere oplysninger til din Berlingske Media konto kan du gøre dette på vore selvbetjeningssider på de forskellige sites.
    </p>
    <p>Ved at klikke på nedenstående kategorier kan du se de persondata, som vi gemmer om dig.</p>
    <CategoryApiList/>
    <p>
      Det kan forekomme at vi har data på dig i nedenstående kategorier. Dem kan vi dog ikke præsentere automatisk. Du har derfor mulighed for at anmode om manuel indsigt eller sletning i disse kategorier, som vi herefter vil levere til dig på mail inden for 30 dage.
    </p>
    <CategoryManualList/>
  </Fragment>
);
