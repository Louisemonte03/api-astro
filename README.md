# API

## week 1

### Dag 1 — Woensdag 1 april

**Wat heb ik gedaan?**
Als eerst zijn we aan de slag gegaan met de introductie over astro en de API. We moesten een paar web API's vinden en content API's met het groepje. De API's zijn gevonden en zo begon ik met mijn eerste idee. We hebben ook een workshop gehad over hoe je astro moet gebruiken. Wel begrijpelijk maar nog een klein beetje ingewikkeld. Vandaag ben ik gelijk aan de slag gegaan met mijn concept. Het concept word eigenlijk een soort swipe cleaner. De struggle op spotify is dat je alles handmatig je playlist uit moet verwijderen als je een nummer er niet meer in wil hebben. Mijn idee is eigenlijk dat een gebruiker op deze website zijn playlist kan kiezen en dan een soort spelletje speelt om van links naar rechts te gaan met je muis of je duim. Links je verwijderd het nummer uit je playlist, rechts je behoudt het nummer in de playlist. De bedoeling is ook dat hij dan ook de track even kort afspeeld. Dat is tot nu toe voor het concept dat ik heb uitgewerkt

Om de spotify te gebruiken moet je een profiel hebben en je aanmelden om een app te createn. Daarbij kreeg ik allemaal informatie dat ik nodig had. Ook namelijk de code die ik moet gebruiken om de user op te halen. Er staat dus al code in mn JS. Maar dat is puur om de user op te halen uit spotify om zo alle data te krijgen.

**Hoe lang duurde het?**
Ik ben hier de hele dag mee bezig geweest

**Wat heb ik geleerd?**
Vandaag heb ik geleerd hoe astro werkt en een opfrissing van fetch. Ook om data uit de api terug te zetten in de html. Dat wist ik al maar ging vandaag makkelijker

**Wat ga ik morgen doen?**
Morgen zijn er voorgang gesprekken ivm goedevrijdag. Dus ik ga morgen mijn concept presenteren. Heb nu geen visualisatie dus ik ga even iets korts schetsen. Ook ga ik nog even nadenken over welke meerdere API's ik wil gebruiken. De week er na wil ik er voor zorgen dat de local storage werkt want ik vind het nu nog iets lastig om te begrijpen. En om de playlist op te halen.

### Dag 2 — Donderdag 3 april

**Wat heb ik gedaan?**
Vandaag waren er voortgangsgesprekken. In het gesprek met Jad kwam naar voren dat ik me moet focussen op **local storage**. Hij gaat hier ook een workshop over geven, dus dat komt goed uit. Qua web API heb ik nog geen definitieve keuze gemaakt — ik denk aan de Popover API, de Local Storage API of misschien de Canvas API. Ik moet nog uitzoeken welke het beste bij mijn concept past.

Na het voortgangsgesprek ben ik verder gegaan met het ophalen van tracks uit een playlist. Dat bleek lastiger dan verwacht — ik heb er de rest van de middag aan gewerkt maar het lukte uiteindelijk niet. De Spotify API geeft de data terug op een manier die ik nog niet helemaal goed verwerk in mijn code. Dat neem ik mee naar volgende week.

**Hoe lang duurde het?**
Ochtend voortgangsgesprekken, de rest van de dag verder gewerkt aan de track-functionaliteit.

**Wat heb ik geleerd?**
Dat local storage een belangrijk onderdeel wordt van mijn project en dat ik daar prioriteit aan moet geven. Ook merkte ik dat het ophalen van geneste data uit een API (zoals tracks binnen een playlist) complexer is dan een simpele fetch.

**Wat ga ik volgende week doen?**
Volgende week wil ik de workshop van Jad over local storage meepakken en direct toepassen op mijn project. Ik ga ook verder proberen de tracks uit een playlist op te halen — dat moet echt gaan werken voor ik verder kan met het swipe-mechanisme.

## Weekreflectie — Week 1

Deze eerste week was vooral een week van opstarten en ontdekken. Ik ben begonnen met een concept dat ik gaaf vind: een swipe-interface waarmee je snel nummers uit je Spotify-playlist kunt verwijderen of behouden. Dat idee staat, en dat voelt goed.

Wat ik heb gemerkt is dat de technische kant meer tijd kost dan ik dacht. Astro was nieuw voor me en hoewel de workshop hielp, kost het gewoon tijd om ermee vertrouwd te raken. De Spotify API werkt op zich, maar zodra je dieper gaat zoals tracks ophalen uit een playlist

Het voortgangsgesprek met Jad was waardevol. Het gaf me focus: local storage is de volgende stap, en ik moet nog een tweede web API kiezen die echt iets toevoegt aan mijn concept. Moet uiteindelijk wel logish aansluiten

Wat ik meeneem naar volgende week: meer structuur aanbrengen in wat ik wil bereiken per dag, en niet te lang vastlopen op één probleem zonder hulp te vragen.

## week 2

### Dag 3 — Woensdag 8 april

**Wat heb ik gedaan?**
Vandaag hadden we een Astro-workshop. Die was goed te volgen en te begrijpen.

**Hoe lang duurde het?**
Van 9:30 tot 12:00. Daarna crashte mijn code — ik kon de user en de bijbehorende playlists nog ophalen, maar verder werkte niets meer. Met Cyd heb ik mijn JavaScript opgeschoond en kreeg ik de Spotify-code beter onder de knie. Aan het eind van de dag was ik niet veel verder gekomen qua functionaliteit, maar ik heb wel een veel beter begrip van hoe alles in elkaar zit.

**Wat heb ik geleerd?**
Hoe Astro werkt — dat moet ik nu alleen nog toepassen op mijn eigen project.

**Wat ga ik morgen doen?**
Ik wil morgen in ieder geval de rest van de data uit de API kunnen ophalen. Daarvoor ga ik met Jad en Cyd zitten.

### Dag 4 — Donderdag 9 april

**Wat heb ik gedaan?**
![alt tekst](/readme-images/stijling-tracks.png) Vandaag ben ik aan de slag gegaan met de tracks op te halen van de gebruiker. Ik kwam er vandaag achter dat spotify elk uur een nieuwe accestoken geeft dus ik moet elke keer LocalStorage.clear doen. Vandaag heet Jad een workshop over local storage geven en begon dat beter te gebruiken. ook heb ik de astro templates toegevoegd. Zo heb ik componenten en layouts aangemaakt en heb ik de style sheets gekoppeld. Ook ben ik vandaag bezig geweest met de styling van de pagina, heel simpel groen.
![alt tekst](/readme-images/opzetje.png)
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
Vandaag heb ik de tracks succesvol ingeladen in de app. Dat was even puzzelen, maar het is gelukt. Daarnaast heb ik een les gevolgd over dynamische routes in Astro, wat goed van pas gaat komen voor de verdere opbouw van Swipify.

**Hoe lang duurde het?**
hele dag mee bezig geweest dus 8 uurtjes ofzo

**Wat heb ik geleerd?**
Hoe dynamische routes werken in Astro en hoe je die koppelt aan data in dit geval trackdata van Spotify. Ook ben ik beter gaan begrijpen hoe de data door de app heen stroomt, van de API-call naar de pagina.

**Wat ga ik morgen doen?**
Morgen wil ik twee Web API's integreren: de Pointer Events API en de Web Animations API. De Pointer Events API gebruik ik voor de swipe-interactie, de Web Animations API voor vloeiende animaties bij het swipen. Daarnaast moet de update van de afspeellijst nog worden afgehandeld zonder die logica werkt de kern van de app niet. Dat is dus prioriteit. Als er tijd over is, wil ik ook audio per track toevoegen als extra feature.

### Dag 6 — Donderdag 16 april

**Wat heb ik gedaan?**
HTML, CSS en JavaScript opgeschoond — dubbele code verwijderd en de codebase opgeruimd. Daarnaast twee Web API's geïmplementeerd: Pointer Events (voor betere input-afhandeling van muis, touch en stylus) en de Web Animations API.

**Hoe lang duurde het?**
4 uurtjes

**Wat heb ik geleerd?**
Pointer Events zijn een uniforme manier om input te verwerken van muis, touch én stylus via één event-systeem pointerdown, pointermove pointerup. Met setPointerCapture zorg je dat een element events blijft ontvangen, ook als de pointer erbuiten beweegt.

De Web Animations API laat je animaties direct via JavaScript aansturen zonder CSS-klassen te toglen. Met element.animate definieer je keyframes en timing, de .finished promise laat je wachten tot een animatie klaar is, en met getAnimations en animation.cancel houd je controle over lopende animaties.

**Wat ga ik volgende week doen?**
Prioriteit 1 — de lijst kunnen updaten (toevoegen/bewerken/verwijderen).
Prioriteit 2 — audio: de tracks die afspelen werkend krijgen.

## Weekreflectie — Week 3

Geen voortgangs gesprek

## week 4

### Dag 7 — Woensdag 0 april

**Wat heb ik gedaan?**
**Hoe lang duurde het?**
**Wat heb ik geleerd?**
**Wat ga ik morgen doen?**

### Dag 8 — Donderdag 0 april

**Wat heb ik gedaan?**
**Hoe lang duurde het?**
**Wat heb ik geleerd?**
**Wat ga ik volgende week doen?**

## Weekreflectie — Week 4
