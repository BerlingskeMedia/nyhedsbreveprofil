import React, { Fragment } from 'react';
import { CategoryManualList } from '../CategoryManualList/CategoryManualList';
import { LogoutLink } from '../logout/LogoutLink';
import { CategoryApiList } from '../CategoryApiList/CategoryApiList';

export const HomePage = () => (
  <Fragment>
    <p>
      Vi kan kun finde frem til dine data på baggrund af de oplysninger vi har på dig. Dem kan du se herunder. Hvis du ønsker at tilføje yderligere oplysninger til din Berlingske Media konto kan du gøre dette på vore selvbetjeningssider på de forskellige sites.
    </p>
    <p>Ved at klikke på nedenstående kategorier kan du se de persondata, som vi gemmer om dig.</p>
    <CategoryApiList/>
    <p>
      Det kan forekomme at vi har data på dig i nedenstående kategorier. Du har derfor mulighed for at anmode om manuel indsigt eller sletning i disse kategorier, som vi herefter vil levere til dig på mail inden for 30 dage.
    </p>
    <CategoryManualList/>
    <p>Udover hvad der fremgår af ovennævnte oversigt, anvender vi desuden cookies på alle vores websites. Du kan læse nærmere herom i vores <a href="https://www.berlingskemedia.dk/cookie-og-privatlivspolitik">cookie- og privatlivspolitik</a>, herunder hvordan du undgår cookies og sletter dem.</p>
  </Fragment>
);
