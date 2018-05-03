import React from 'react';
import { LoginForm } from '../LoginForm/LoginForm';
import { InsightTable } from '../InsightTable/InsightTable';

import './LoginPage.scss';

export const LoginPage = () => (
  <div className="LoginPage">
    <h1>Se dine persondata hos Berlingske Media</h1>
    <p>Hos Berlingske Media tager vi behandlingen af dine persondata meget alvorligt. Dette site har derfor til formål at skabe størst mulig transparens omkring hvilke data vi behandler.</p>
    <p>Du kan få indsigt i de data, som vi har på dig, ved at logge ind med din Berlingske Media konto. Har du ikke en Berlingske Media konto, beder vi dig oprette en med de oplysninger, vi skal bruge for at kunne finde dig i vore systemer.</p>
    <p>Login er nødvendigt, fordi vi skal kunne validere, hvem du er, og at du har kontrol over den mailadresse, du har angivet.</p>
    <LoginForm/>
    <InsightTable/>
    <p>Udover hvad der fremgår af ovennævnte oversigt, anvender vi desuden cookies på alle vores websites. Du kan læse nærmere herom i vores <a href="https://www.berlingskemedia.dk/cookie-og-privatlivspolitik">cookie- og privatlivspolitik</a>, herunder hvordan du undgår cookies og sletter dem.</p>
  </div>
);
