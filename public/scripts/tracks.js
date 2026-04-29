// Lijst van alle nummers in de playlist
// We gebruiken "let" omdat deze lijst later gevuld wordt via de API
let tracks = [];

// Lijst van nummers die de gebruiker heeft bewaard (swipe rechts)
// Wordt aan het einde naar Spotify gestuurd om de playlist bij te werken
let keptTracks = [];

// Bijhouden welk nummer er nu getoond wordt (positie in de tracks array)
// Begint op 0 = het eerste nummer, wordt opgehoogd na elke swipe
let currentIndex = 0;

// Telt hoeveel nummers de gebruiker heeft verwijderd (swipe links)
// Alleen voor de samenvatting aan het einde
let removedCount = 0;

// Haal het kaart-element op uit de HTML via zijn ID
// We doen dit één keer bovenaan zodat we het niet steeds opnieuw hoeven te zoeken
const card = document.getElementById("track-card");

// Minimale afstand in pixels die je moet swipen voordat het telt als een swipe
// Zonder deze grens zou elke kleine aanraking al een swipe triggeren
const SWIPE_THRESHOLD = 100;

// Haal het Spotify access token op uit de browser opslag
// Dit token is opgeslagen na het inloggen op de callback-pagina
const accessToken = localStorage.getItem("accessToken");

// Haal het playlist ID op uit de URL, bijv. /tracks?id=abc123
// new URLSearchParams() leest de "query string" na het vraagteken in de URL
const playlistId = new URLSearchParams(window.location.search).get("id");

// Startpositie van de vinger/muis op het moment dat je begint te slepen
// Wordt opgeslagen bij "pointerdown" en gebruikt om de afstand te berekenen
let startX = 0;

// Hoeveel pixels de gebruiker heeft gesleept t.o.v. het startpunt
// Positief = naar rechts, negatief = naar links
let dragX = 0;

// Vlag die bijhoudt of de gebruiker op dit moment aan het slepen is
// Voorkomt dat "pointermove" iets doet als je niet aan het slepen bent
let isDragging = false;

// Het apparaat-ID van de Spotify speler in de browser
// Spotify heeft dit nodig om te weten naar welk apparaat muziek gestuurd moet worden
let deviceId = null;

// Deze functie wordt automatisch aangeroepen door de Spotify SDK zodra die klaar is met laden
// We zetten hem op "window" zodat de externe SDK hem kan vinden
window.onSpotifyWebPlaybackSDKReady = () => {
  // Maak een nieuwe Spotify speler aan die in de browser afspeelt (Web Playback)
  const player = new Spotify.Player({
    name: "PlaylistSwipe", // Naam die zichtbaar is in de Spotify app onder "Apparaten"
    getOAuthToken: (cb) => cb(accessToken), // SDK vraagt het token op: geef het door via de callback "cb"
    volume: 0.5, // Standaard volume op 50% (0 = stil, 1 = max)
  });

  // Luister op het "ready" event: wordt getriggerd zodra de speler verbonden is met Spotify
  // "device_id" is het unieke ID van deze browser-speler
  player.addListener("ready", ({ device_id }) => {
    deviceId = device_id; // Sla het op zodat we het kunnen meesturen bij afspeelverzoeken
    playCurrentTrack(); // Speel meteen het eerste nummer af
  });

  // Verbind de speler met Spotify (start de verbinding op)
  player.connect();
};

// Speelt het huidige nummer af door een verzoek te sturen naar de Spotify API
async function playCurrentTrack() {
  const track = tracks[currentIndex];

  // Veiligheidscheck: stop als de speler nog niet klaar is of het nummer geen URI heeft
  // "?." is "optional chaining": als track undefined is crasht het niet maar geeft het undefined terug
  if (!deviceId || !track?.uri) return;

  // PUT-verzoek naar de Spotify API: start het afspelen op dit apparaat
  // We sturen de URI mee zodat Spotify weet welk nummer afgespeeld moet worden
  await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    {
      method: "PUT", // PUT = vervang/update een bestaande resource (in dit geval de afspeelstatus)
      headers: {
        Authorization: `Bearer ${accessToken}`, // Token bewijst dat we gemachtigd zijn
        "Content-Type": "application/json", // We sturen JSON in de body mee
      },
      body: JSON.stringify({ uris: [track.uri] }), // De Spotify URI van het nummer, bijv. "spotify:track:abc"
    },
  );
}

// Wanneer de gebruiker op de kaart drukt (muis of vinger): start het slepen
card.addEventListener("pointerdown", (e) => {
  isDragging = true;
  startX = e.clientX; // e.clientX = de horizontale positie van de muis/vinger op het scherm
  dragX = 0;
  card.setPointerCapture(e.pointerId); // Zorgt dat de kaart de muis/vinger blijft volgen ook als je eraf glijdt
  card.style.animation = "none"; // Stop CSS-animaties zodat ze het slepen niet verstoren
});

// Terwijl de gebruiker sleept: beweeg en kantel de kaart mee met de vinger
card.addEventListener("pointermove", (e) => {
  if (!isDragging) return; // Doe niks als we niet aan het slepen zijn
  dragX = e.clientX - startX; // Bereken de afstand t.o.v. het startpunt
  // translateX schuift de kaart horizontaal, rotate kantelt hem iets mee voor een natuurlijk gevoel
  // 0.05 is de kantelverhouding: hoe verder je sleept, hoe meer de kaart kantelt
  card.style.transform = `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`;
});

// Wanneer de gebruiker loslaat: besliss of het een swipe is of terugveren naar het midden
card.addEventListener("pointerup", () => {
  if (!isDragging) return;
  isDragging = false;

  if (Math.abs(dragX) > SWIPE_THRESHOLD) {
    // Math.abs geeft de absolute waarde (dus altijd positief), zodat links én rechts gecontroleerd wordt
    // Ver genoeg gesleept: voer een echte swipe uit
    swipeCard(dragX > 0 ? "right" : "left"); // dragX positief = naar rechts gesleept
  } else {
    // Niet ver genoeg: animeer de kaart soepel terug naar het midden
    card
      .animate(
        [
          { transform: `translateX(${dragX}px) rotate(${dragX * 0.05}deg)` }, // Huidige positie
          { transform: "translateX(0) rotate(0deg)" }, // Eindpositie: midden, geen rotatie
        ],
        { duration: 200, easing: "ease-out" }, // ease-out = begint snel, vertraagt naar het einde
      )
      .finished.then(() => {
        // .finished is een Promise die pas afloopt als de animatie klaar is
        // Reset de inline stijl zodat CSS weer de controle heeft
        card.style.transform = "";
        card.style.animation = "";
      });
    dragX = 0;
  }
});

// Animeer de kaart uit beeld en sla de keuze op (bewaren of verwijderen)
function swipeCard(direction) {
  // Bereken hoe ver buiten het scherm de kaart moet landen
  // 1.5x de schermbreedte zorgt dat de kaart echt volledig verdwijnt
  const targetX =
    direction === "right" ? window.innerWidth * 1.5 : -window.innerWidth * 1.5;

  // Kantelhoek aan het einde van de animatie: 30 graden rechts of -30 graden links
  const rotation = direction === "right" ? 30 : -30;

  card
    .animate(
      [
        { transform: `translateX(${dragX}px) rotate(${dragX * 0.05}deg)` }, // Huidige sleeppositie
        { transform: `translateX(${targetX}px) rotate(${rotation}deg)` }, // Eindpositie buiten scherm
      ],
      {
        duration: 300, // 300ms animatieduur
        easing: "ease-out",
        fill: "forwards", // Houdt de eindpositie vast na de animatie (anders springt de kaart terug)
      },
    )
    .finished.then(() => {
      // Verwerk de keuze pas nadat de animatie klaar is
      if (direction === "right") {
        // Rechts geswiped: voeg het nummer toe aan de bewaarde lijst
        keptTracks.push(tracks[currentIndex]);
      } else {
        // Links geswiped: verhoog de verwijderteller (nummer wordt niet bewaard)
        removedCount++;
      }
      currentIndex++; // Ga naar het volgende nummer in de array
      dragX = 0;
      showTrack(); // Laad en toon het volgende nummer
    });
}

// Sla de bijgewerkte playlist op in Spotify met alleen de bewaarde nummers
async function savePlaylist() {
  const btn = document.getElementById("btn-save");
  btn.disabled = true; // Uitschakelen voorkomt dat de gebruiker twee keer op opslaan drukt
  btn.innerText = "Opslaan...";

  // .map() maakt een nieuwe array met alleen de URI van elk bewaard nummer
  // Spotify heeft alleen de URIs nodig om de playlist bij te werken
  const uris = keptTracks.map((t) => t.uri);

  // PUT-verzoek naar de Spotify API: vervang alle nummers in de playlist door de bewaarde nummers
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/items`,
    {
      method: "PUT", // PUT vervangt de volledige inhoud van de playlist
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris }), // { uris } is hetzelfde als { uris: uris }
    },
  );

  if (response.ok) {
    // response.ok is true als de statuscode tussen 200 en 299 zit (= succes)
    btn.innerText = "Opgeslagen!";
    btn.style.opacity = "0.6"; // Maak de knop lichter zodat het duidelijk is dat hij klaar is
  } else {
    // Iets ging mis: lees de foutmelding en toon die in de console
    const err = await response.text();
    console.error("Opslaan mislukt:", response.status, err);
    btn.innerText = "Mislukt — probeer opnieuw";
    btn.disabled = false; // Zet de knop terug aan zodat de gebruiker het opnieuw kan proberen
  }
}

// Knop "verwijderen": zet dragX op 0 en voer een swipe naar links uit
// dragX = 0 zorgt dat de animatie begint vanuit het midden (niet vanuit een sleeppositie)
document.getElementById("btn-reject").onclick = () => {
  dragX = 0;
  swipeCard("left");
};

// Knop "bewaren": zet dragX op 0 en voer een swipe naar rechts uit
document.getElementById("btn-keep").onclick = () => {
  dragX = 0;
  swipeCard("right");
};

// Haal alle nummers op van de geselecteerde playlist via de Spotify API
async function getPlaylistTracks() {
  // Haal de playlistnaam op uit de URL, bijv. /tracks?name=MijnPlaylist
  const playlistName = new URLSearchParams(window.location.search).get("name");
  // ?? "" betekent: als playlistName null of undefined is, gebruik dan een lege string
  document.getElementById("playlist-title").innerText = playlistName ?? "";

  // Veiligheidscheck: als token of ID ontbreekt kunnen we geen API-verzoek doen
  if (!accessToken || !playlistId) {
    console.error("Geen token of playlist ID gevonden");
    return; // Stop de functie hier
  }

  // Vraag de nummers op bij de Spotify API, maximaal 50 tegelijk
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/items?limit=50`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!response.ok) {
    console.error("Fout bij ophalen nummers:", response.status);
    return;
  }

  const data = await response.json();

  // De API geeft items terug die soms in "item" of "track" zitten, afhankelijk van het type
  // "??" pakt de eerste die niet null/undefined is
  // .filter(Boolean) verwijdert alle lege/null waarden uit de array
  tracks = data.items.map((item) => item.item ?? item.track).filter(Boolean);

  showTrack(); // Toon het eerste nummer
}

// Toont het huidige nummer op de kaart, of een eindscherm als alle nummers geweest zijn
function showTrack() {
  // Haal alle lopende animaties op de kaart op en stop ze allemaal
  // Dit is nodig omdat een snelle swipe een nieuwe kaart kan tonen terwijl de vorige animatie nog loopt
  // Zonder cancel() zou de oude animatie de nieuwe positie overschrijven
  card.getAnimations().forEach((a) => a.cancel());

  // Reset de inline transform en animatiestijl zodat de kaart weer in het midden staat
  card.style.transform = "";
  card.style.animation = "";

  // Controleer of alle nummers al zijn langsgekomen
  if (currentIndex >= tracks.length) {
    // Pauzeer de muziek via de API als de speler actief is
    if (deviceId) {
      fetch(
        `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
    }

    // Verberg de swipe-knoppen want er valt niks meer te swipen
    document.getElementById("buttons").style.display = "none";

    // Vervang de inhoud van de kaart met een eindscherm
    // Template literals (backticks) laten toe om variabelen in HTML te zetten met ${}
    card.innerHTML = `
      <div class="done-state">
        <span class="done-icon">
          <img src="/images/spotify.svg" width="20px" height="auto" alt="Spotify">
        </span>
        <p class="done-title">Alle nummers zijn geweest</p>
        <p class="done-subtitle">${keptTracks.length} bewaard &middot; ${removedCount} verwijderd</p>
      </div>
    `;

    // Toon de opslaan- en terugknop die normaal verborgen zijn (display:none in de HTML)
    document.getElementById("btn-save").style.display = "block";
    document.getElementById("btn-back").style.display = "block";
    return; // Stop de functie hier, de rest hoeft niet meer te lopen
  }

  // Haal het huidige nummer op uit de array
  const track = tracks[currentIndex];

  // Vul de kaart in met de gegevens van het nummer
  // "?." = optional chaining: als images leeg is crasht het niet maar geeft het undefined terug
  // "?? ''" = als het undefined is, gebruik dan een lege string als fallback
  document.getElementById("track-img").src = track.album.images[0]?.url ?? "";
  document.getElementById("track-name").innerText = track.name;
  document.getElementById("track-artist").innerText = track.artists[0].name;

  // Speel het nummer af via de Spotify speler
  playCurrentTrack();
}

// Roep getPlaylistTracks aan zodra het script geladen is
// Dit is het startpunt van de hele pagina
getPlaylistTracks();
