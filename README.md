# API

## week 1

### Dag 1 — Woensdag 1 april

**Wat heb ik gedaan?**
Als eerst kregen we een introductie over astro en de api. We moesten een paar web api's vinden en content api's met het groepje. De api's had ik gevonden maar wist gelijk al wat ik wilde doen als idee. Ik wilde iets doen met spotify. Die dag kregen we ook workshops over hoe je astro moet gebruiken. Vandaag ben ik gelijk aan de slag gegaan met mijn concept. Het concept word eigenlijk een soort swipe cleaner. De struggle op spotify is dat je alles handmatig je playlist uit moet verwijderen als je een nummer er niet meer in wil hebben. Mijn idee is eigenlijk dat een gebruiker op deze website zijn playlist kan kiezen en dan een soort spelletje speelt om van links naar rechts te gaan met je muis of je duim. Links je verwijderd het nummer uit je playlist, rechts je behoudt het nummer in de playlist. De bedoeling is ook dat hij dan ook de track even kort afspeeld. Dat is tot nu toe voor het concept dat ik heb uitgewerkt

Om de spotify te gebruiken moet je een profiel hebben en je aanmelden om een app te createn. Daarbij kreeg ik allemaal informatie dat ik nodig had. Ook namelijk de code die ik moet gebruiken om de user op te halen. Er staat dus al code in mn JS. Maar dat is puur om de user op te halen uit spotify om zo alle data te krijgen.

**Hoe lang duurde het?**
Ik ben hier de hele dag mee bezig geweest

**Wat heb ik geleerd?**
Vandaag heb ik geleerd hoe astro werkt en een opfrissing van fetch. Ook om data uit de api terug te zetten in de html. Dat wist ik al maar ging vandaag makkelijker

**Wat ga ik morgen doen?**
Morgen zijn er voorgang gesprekken ivm goedevrijdag. Dus ik ga morgen mijn concept presenteren. Heb nu geen visualisatie dus ik ga even iets korts schetsen. Ook ga ik nog even nadenken over welke meerdere API's ik wil gebruiken. De week er na wil ik er voor zorgen dat de local storage werkt want ik vind het nu nog iets lastig om te begrijpen. En om de playlist op te halen.

### Dag 2 — Donderdag 3 april

**Wat heb ik gedaan?**
Vandaag waren er voortgangsgesprekken. In het gesprek met Jad kwam naar voren dat ik me moet focussen op local storage. Hij gaat hier ook een workshop over geven, dus dat komt goed uit. Qua web API heb ik nog geen definitieve keuze gemaakt — ik denk aan de Popover API, de Local Storage API of misschien de Canvas API. Ik moet nog uitzoeken welke het beste bij mijn concept past.

Na het voortgangsgesprek ben ik verder gegaan met het ophalen van tracks uit een playlist. Dat bleek lastiger dan verwacht — ik heb er de rest van de middag aan gewerkt maar het lukte uiteindelijk niet. De Spotify API geeft de data terug op een manier die ik nog niet helemaal goed verwerk in mijn code. Dat neem ik mee naar volgende week.

**Hoe lang duurde het?**
Ochtend voortgangsgesprekken, de rest van de dag verder gewerkt aan de track functie van het halen van de playlisten.

**Wat heb ik geleerd?**
Dat local storage een belangrijk onderdeel wordt van mijn project en dat ik daar prioriteit aan moet geven. Ook merkte ik dat het ophalen van geneste data uit een APIzoals tracks binnen een playlist moeilijker is dan een simpele fetch.

**Wat ga ik volgende week doen?**
Volgende week wil ik de workshop van jad over local storage meepakken en direct toepassen op mijn project. Ik ga ook verder proberen de tracks uit een playlist op te halen dat moet echt gaan werken voor ik verder kan met het swipe functie.

## Weekreflectie — Week 1

Deze eerste week was vooral een week van opstarten en oonderzoeken. Ik ben begonnen met een concept: een swipe functie waarmee je snel nummers uit je spotify playlist kunt verwijderen of behouden.

Wat ik heb gemerkt is dat de technische kant meer tijd kost dan ik dacht. astro was nieuw voor me en hoewel de workshop hielp, kost het gewoon tijd om ermee vertrouwd te raken. De spotify Api werkt op zich, maar zodra je dieper gaat zoals tracks ophalen uit een playlist word het veel en veel lastiger.

Het voortgangsgesprek met Jad was goe. Het gaf mij een paar punten om op te focussen zoals de local storage en de volgende web api's die ik moet kiezen

## week 2

### Dag 3 — Woensdag 8 april

**Wat heb ik gedaan?**
Vandaag hadden we een astro worksop. Die was goed te volgen en te begrijpen.

**Hoe lang duurde het?**
Van 9:30 tot 12:00. Daarna crashte mijn code, ik kon de user en de playlists nog ophalen, maar verder werkte niets meer. Met Cyd heb ik mijn javscript opgeschoond en kreeg ik de spotify code beter onder de knie. Aan het eind van de dag was ik niet vele verder gekomen helaas. Maar ik heb wel een veel beter begrip van hoe alles in elkaar zit.

**Wat heb ik geleerd?**
Hoe Astro werkt, dat moet ik nu alleen nog toepassen op mijn eigen project.

**Wat ga ik morgen doen?**
Ik wil morgen in ieder geval de rest van de data uit de api kunnen ophalen. Daarvoor ga ik met Jad en Cyd zitten.

### Dag 4 — Donderdag 9 april

**Wat heb ik gedaan?**
![stijling tracks](/readme-images/stijling-tracks.png) Vandaag ben ik aan de slag gegaan met de tracks op te halen van de gebruiker. Ik kwam er vandaag achter dat spotify elk uur een nieuwe accestoken geeft dus ik moet elke keer LocalStorage.clear() doen. Vandaag heet Jad een workshop over local storage geven en begon dat beter te gebruiken. ook heb ik de astro templates toegevoegd. Zo heb ik componenten en layouts aangemaakt en heb ik de style sheets gekoppeld. Ook ben ik vandaag bezig geweest met de styling van de pagina, heel simpel groen.
![eerste opzetje](/readme-images/opzetje.png)
**Hoe lang duurde het?**
Duurde de hele dag. Klein workshopje van half uurtje. Rest van de dag bezig geweest en om hulp gevraagd bij Jad en Cyd
**Wat heb ik geleerd?**
Wat ik vandaag heb geleerd zijn veel local storage. En hoe we de tracks ophalen.
**Wat ga ik volgende week doen?**
Voor volgende week wil ik de tracks ophalen. En die gaan gebruiken om de swipe functie te bouwen.

## Weekreflectie — Week 3

Deze week was best raar want woesndag had ik eigenlijk het idee dat ik niet veel heb gedaan omdat mijn code niet werkte elke keer. Dat heb ik op donderdag weten te fixen. Zo kon ik naar de styling en het gebruiken van de astro structuur. Ook heb ik nog niet echt 2e api's mar denk dat die nog wel komen. focus me nu vooral op het fixen van de spotify api. De code die in javascript staat is voornamelijk met hulp geschreven door Jad en Cyd en door de api van spotify. Met behulp van claude.

## week 3

### Dag 5 — Woensdag 15 april

**Wat heb ik gedaan?**
Vandaag heb ik de tracks ingeladen in de app. Dat was even puzzelen, maar het is gelukt met behup van jad en combinatie van cyd. Daarnaast heb ik een les gevolgd over dynamische routes in Astro, wat goed van pas gaat komen voor mijn project.

**Hoe lang duurde het?**
hele dag mee bezig geweest dus 8 uurtjes ofzo

**Wat heb ik geleerd?**
Hoe dynamische routes werken in Astro en hoe je die koppelt aan data in dit geval trackdata van Spotify. Ook ben ik beter gaan begrijpen hoe de data door de app heen stroomt, van de api naar de pagina.

**Wat ga ik morgen doen?**
Morgen wil ik 2 web api's gaan toevoegen. Als idee van jad kreeg ik te horen de pointer events api en de web animation api zodat ik echt de een goede gebruikers ervaring kan maken voor bij mijn project. Zo kan de gebruiker een vloeiende animatie hebben bij het swipen.

### Dag 6 — Donderdag 16 april

**Wat heb ik gedaan?**
hmtl css en javscript is opgeschoond. Dubbele code heb ik verweijderd en de daarnaast de 2 web api's toegevoegd.

**Hoe lang duurde het?**
4 uurtjes

**Wat heb ik geleerd?**
Hoe je de web api's toevoegd

**Wat ga ik volgende week doen?**
Prioriteit 1 — Dat de gebruiker de lijst kan updaten
Prioriteit 2 — Dat de gebruiker de track te horen krijgt met webplayback zodat de gebruiker weet welk liedje het is

## Weekreflectie — Week 3

Geen voortgang gesprek want web you want

## week 4

### Dag 7 — Woensdag 22 april

**Wat heb ik gedaan?**
Ik heb de audio afspeelfunctie geimplementeerd voor het nummer. Daarnaast heb ik gewerkt aan het updaten van de lijst, wat meer tijd kostte dan verwacht.

**Hoe lang duurde het?**
Hele dag mee bezig geweest

**Wat heb ik geleerd?**
Dat de huidige documentatie van spotify over het updaten. Heb ik uiteindelijk de deprecated documentatie gebruikt om de lijst-update werkend te krijgen. Soms is oudere documentatie nog steeds de meest praktische oplossing. Mar voor nu is de deprecated prima om te gebruiken voor tijdelijk.

**Wat ga ik morgen doen?**
Verder met het updaten van de lijst en de applicatie live zetten op Render.

### Dag 8 — Donderdag 23 april

**Wat heb ik gedaan?**
Verder gegaan met het updaten van de lijst en de applicatie gezet op Render. Er zijn nog een aantal dingen die niet goed functioneren in de live omgeving. Daarbij heeft cyd mij mee geholpen

**Hoe lang duurde het?**
Hele dag mee bezig geweest

**Wat heb ik geleerd?**
Dat een lokaal werkende applicatie zich anders kan gedragen in een productieomgeving. Deployment brengt eigen uitdagingen met zich mee die je lokaal niet tegenkomt. (geleerd van cyd en jad)

**Wat ga ik volgende week doen?**
Volgende week is het vakantie en dan ga ik alles dubbel check doen en puntjes op de i doen.

## Weekreflectie — Week 4

Deze week was best pittig. Ik heb de audio functie werkend gekregen via de spotify webplayback SDK. Het updaten van de playlist was een flinke struggle de normale documentatie werkte niet en uiteindelijk heb ik de deprecated documentatie maar gebruikt. Niet ideaal, maar het werkte wel.

Op donderdag heb ik de app live gezet op Render, ik zag gelijk dat er nog dingen niet kloppen in de live omgeving. Dingen die lokaal gewoon werkten, doen het ineens niet meer.

Volgende week ga ik die bugs in Render fixen

## Bronnen

### Spotify

- [Spotify Web API — Authorization Code + PKCE Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow) — gebruikt in script.js voor de volledige OAuth login flow
- [Spotify Web API — Token endpoint](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-an-access-token) — gebruikt in script.js om een access token op te halen na login
- [Spotify Web API — Get Current User's Profile](https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile) — gebruikt in script.js om de ingelogde gebruiker op te halen
- [Spotify Web API — Get Playlist Items](https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks) — gebruikt in tracks.js om de nummers van een playlist op te halen
- [Spotify Web API — Update Playlist Items (deprecated PUT)](https://developer.spotify.com/documentation/web-api/reference/reorder-or-replace-playlists-tracks) — gebruikt in tracks.js om de playlist op te slaan na het swipen (deprecated endpoint, maar werkt nog wel)
- [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/) — gebruikt in tracks.js om tracks af te spelen in de browser

### Web API's

- [Pointer Events API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) — gebruikt in tracks.js voor de swipe-interactie met muis, touch en stylus
- [Web Animations API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) — gebruikt in tracks.js voor de swipe-animaties via element.animate()
- [Web Crypto API — SubtleCrypto.digest() — MDN](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest) — gebruikt in mijn script.js voor de SHA-256 hashing bij het aanmaken van de PKCE code challenge

Commits door Claude->
Ik heb tijdens dit project soms Claude gebruikt, vooral in de vakantie omdat ik dan alleen werkte. Ook had ik op een gegeven moment problemen met Render en heb ik Claude gebruikt om dat te fixen via commits.
