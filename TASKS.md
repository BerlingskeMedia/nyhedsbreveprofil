# nyhedsbreve

## Sider (opgavebeskrivelse)

### /
Parametre:

- ekstern_id (optional)
- publisher_id (optional)

Tilmeld siden ala. http://email.medieimperiet.dk/ hvor publishers er i dropdown.
Logoer på "publisher". Men ingen logoer på "nyhedsbreve". De skal bare se ud som Berlingske.

Vælg publisher i i dropdown, hvis `publisher_id` er sat.

Efter man trykker tilmeld, lander man på enten `/opret` eller `/tilmeldt` alt efter om man er anonym eller logget ind.


### /tilmeldt
Når man tilmelder sig, kan vi endnu ikke udsende nogen email som bekræftelse. Det er vist nok effektivt med det samme.
Så vi viser en "tak for tilmeldind" ala. http://email.medieimperiet.dk/step-4.php uden email-delen.


### /opret /login
Hvis man ikke findes kom kunde, lander man på denne efter "tilmeld" siden:

Ala. en blading af http://email.medieimperiet.dk/step-2.php og http://email.medieimperiet.dk/my-subscriptions.php?user=anon

Hvis man allerede er oprettet, logges der ind ved at lave en `POST /mails/profile-page-link`.
**Bemærk:**: Den er live og læser fra produktionsdatabasen.

Benyt `"publisher_id": 1` som standard. Ellers benyt `publisher_id` fra parametre.

Ved opret af nye bruger, sendes man forbi http://email.medieimperiet.dk/step-3.php for at sætte permissions.
Profilen oprettes allerede efter step-2. Dvs. Step-3 med interesser er optional.

### /afmeld
Parametre:

- ekstern_id
- nyhedsbrev_id
- publisher_id (optional)

Afmelder ét nyhedsbrev med årsag/begrundelse (optional)
Ala. http://email.medieimperiet.dk/my-subscriptions.php?user=email-link

Vis ekstern_id ikke er valid, sendes brugeren til `/login`.

### /profil
Parametre:

- ekstern_id

Viser tilmeldte nyhedsbreve og interesser
Ala. http://email.medieimperiet.dk/my-subscriptions.php?user=goodboy

Ved ingen nyhedsbreve, vises noget ala.
http://email.medieimperiet.dk/my-subscriptions.php?user=noletters

Vis ekstern_id ikke er valid, sendes brugeren til `/login`.

Interesser hentes fra `http://54.77.4.249:8000/interesser?displayTypeId=3`

## Permissions
En liste over permissions hente ved `http://54.77.4.249:8000/nyhedsbreve?permission=1`.
Man tilmelder sig en persmission på samme måde som man tilmelder sig et nyhedsbrev.

# Smartlinks

Nyhedsbreve (multiselect af /nyhedsbreve)
Interesser (multiselect af /interesser)
Permissions (multiselect af /permissions)
Location (tekst indtastning, med knap til at oprette en location via POST /location - returnerer location_id som skal anvendes i smartlinket. Teksten kan ændres via PUT.)
Flow (Drop down med simpel og doubleopt)
Action (Drop down med tilmeld og afmeld)
Startdato (datepicker)
Slutdato (datepicker, ikke påkrævet)
Kunde felt (Drop down med email og ekstern id)
Landingpage (ikke påkrævet)

eg
http://localhost:8000/smartlinks/?action=70c4dd8af56f5dad9d5483513f049eb6&command=cmd_berlingske_quicksignup&customer_key=a40e4703a823d1d11977928620c6ead0&nlids=300&intids=&stack_key=dcc741e9544beb16005993da368b855c&lid=1799&mid=1&rtype=1&url=&email=<EMAIL>&action=1
