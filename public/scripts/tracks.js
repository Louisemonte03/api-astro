// Lijst van alle nummers in de playlist
let tracks = [];

// Lijst van nummers die de gebruiker heeft bewaard (swipe rechts)
let keptTracks = [];

// Bijhouden welk nummer er nu getoond wordt (positie in de tracks array)
let currentIndex = 0;

// Telt hoeveel nummers de gebruiker heeft verwijderd (swipe links)
let removedCount = 0;

// Haal het kaart-element op uit de HTML
const card = document.getElementById("track-card");

// Minimale afstand in pixels die je moet swipen voordat het telt als een swipe
const SWIPE_THRESHOLD = 100;

// Haal het Spotify access token op uit de browser opslag (wordt opgeslagen na inloggen)
const accessToken = localStorage.getItem("accessToken");

// Haal het playlist ID op uit de URL (bijv. /tracks?id=abc123)
const playlistId = new URLSearchParams(window.location.search).get("id");

// Startpositie van de vinger/muis bij het beginnen van een swipe
let startX = 0;

// Hoeveel pixels de gebruiker heeft gesleept vanaf het startpunt
let dragX = 0;

// Bijhouden of de gebruiker op dit moment aan het slepen is
let isDragging = false;

// Het apparaat-ID van de Spotify speler (nodig om muziek af te spelen)
let deviceId = null;

// Deze functie wordt automatisch aangeroepen door de Spotify SDK zodra die klaar is
window.onSpotifyWebPlaybackSDKReady = () => {
  // Maak een nieuwe Spotify speler aan in de browser
  const player = new Spotify.Player({
    name: "PlaylistSwipe", // Naam die zichtbaar is in Spotify Connect
    getOAuthToken: (cb) => cb(accessToken), // Geef het access token door aan de SDK
    volume: 0.5, // Standaard volume op 50%
  });

  // Zodra de speler klaar en verbonden is, sla het device ID op en speel het eerste nummer af
  player.addListener("ready", ({ device_id }) => {
    deviceId = device_id;
    playCurrentTrack();
  });

  // Maak verbinding met Spotify
  player.connect();
};

// Speelt het huidige nummer af via de Spotify API
async function playCurrentTrack() {
  const track = tracks[currentIndex];

  // Stop als er geen speler of geen nummer beschikbaar is
  if (!deviceId || !track?.uri) return;

  // Stuur een verzoek naar de Spotify API om het nummer af te spelen op dit apparaat
  await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris: [track.uri] }), // Stuur de Spotify URI van het nummer mee
    },
  );
}

// Wanneer de gebruiker op de kaart drukt: start het slepen
card.addEventListener("pointerdown", (e) => {
  isDragging = true;
  startX = e.clientX; // Onthoud de startpositie
  dragX = 0;
  card.setPointerCapture(e.pointerId); // Zorg dat de kaart de muis/vinger blijft volgen
  card.style.animation = "none"; // Stop eventuele lopende animaties
});

// Terwijl de gebruiker sleept: beweeg en kantel de kaart mee
card.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  dragX = e.clientX - startX; // Bereken hoeveel er gesleept is
  card.style.transform = `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`; // Beweeg en kantel
});

// Wanneer de gebruiker loslaat: besliss of het een swipe is of terugveren
card.addEventListener("pointerup", () => {
  if (!isDragging) return;
  isDragging = false;

  if (Math.abs(dragX) > SWIPE_THRESHOLD) {
    // Ver genoeg gesleept: voer een echte swipe uit
    swipeCard(dragX > 0 ? "right" : "left");
  } else {
    // Niet ver genoeg: animeer de kaart terug naar het midden
    card
      .animate(
        [
          { transform: `translateX(${dragX}px) rotate(${dragX * 0.05}deg)` },
          { transform: "translateX(0) rotate(0deg)" },
        ],
        { duration: 200, easing: "ease-out" },
      )
      .finished.then(() => {
        // Reset de stijl nadat de animatie klaar is
        card.style.transform = "";
        card.style.animation = "";
      });
    dragX = 0;
  }
});

// Animeer de kaart uit beeld en verwerk de keuze (bewaren of verwijderen)
function swipeCard(direction) {
  // Bepaal hoe ver de kaart naar rechts of links vliegt (buiten het scherm)
  const targetX =
    direction === "right" ? window.innerWidth * 1.5 : -window.innerWidth * 1.5;

  // Kantelhoek: rechts = positief, links = negatief
  const rotation = direction === "right" ? 30 : -30;

  // Animeer de kaart uit beeld
  card
    .animate(
      [
        { transform: `translateX(${dragX}px) rotate(${dragX * 0.05}deg)` },
        { transform: `translateX(${targetX}px) rotate(${rotation}deg)` },
      ],
      { duration: 300, easing: "ease-out", fill: "forwards" },
    )
    .finished.then(() => {
      if (direction === "right") {
        // Rechts geswiped: nummer bewaren
        keptTracks.push(tracks[currentIndex]);
      } else {
        // Links geswiped: nummer verwijderen, teller ophogen
        removedCount++;
      }
      currentIndex++; // Ga naar het volgende nummer
      dragX = 0;
      showTrack(); // Toon het volgende nummer
    });
}

// Sla de bijgewerkte playlist op in Spotify (alleen de bewaarde nummers)
async function savePlaylist() {
  const btn = document.getElementById("btn-save");
  btn.disabled = true; // Knop uitschakelen zodat je niet twee keer kunt klikken
  btn.innerText = "Opslaan...";

  // Zet de bewaarde nummers om naar een lijst van Spotify URIs
  const uris = keptTracks.map((t) => t.uri);

  // Stuur de nieuwe lijst naar de Spotify API (vervangt de volledige playlist)
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/items`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris }),
    },
  );

  if (response.ok) {
    // Opslaan gelukt
    btn.innerText = "Opgeslagen!";
    btn.style.opacity = "0.6";
  } else {
    // Opslaan mislukt: toon fout en zet de knop terug aan
    const err = await response.text();
    console.error("Opslaan mislukt:", response.status, err);
    btn.innerText = "Mislukt — probeer opnieuw";
    btn.disabled = false;
  }
}

// Knop "verwijderen": swipe de kaart naar links
document.getElementById("btn-reject").onclick = () => {
  dragX = 0;
  swipeCard("left");
};

// Knop "bewaren": swipe de kaart naar rechts
document.getElementById("btn-keep").onclick = () => {
  dragX = 0;
  swipeCard("right");
};

// Haal alle nummers op van de geselecteerde playlist via de Spotify API
async function getPlaylistTracks() {
  // Haal de playlistnaam op uit de URL (bijv. /tracks?name=MijnPlaylist)
  const playlistName = new URLSearchParams(window.location.search).get("name");
  document.getElementById("playlist-title").innerText = playlistName ?? "";

  // Stop als er geen token of playlist ID is
  if (!accessToken || !playlistId) {
    console.error("Geen token of playlist ID gevonden");
    return;
  }

  // Vraag de nummers op bij de Spotify API (maximaal 50)
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

  // Zet de ruwe API data om naar een lijst van track-objecten en filter lege items eruit
  tracks = data.items.map((item) => item.item ?? item.track).filter(Boolean);

  // Toon het eerste nummer
  showTrack();
}

// Toont het huidige nummer op de kaart, of een eindscherm als alles geweest is
function showTrack() {
  // Stop alle lopende animaties op de kaart en reset de stijl
  card.getAnimations().forEach((a) => a.cancel());
  card.style.transform = "";
  card.style.animation = "";

  // Als alle nummers zijn geweest: toon het eindscherm
  if (currentIndex >= tracks.length) {
    // Pauzeer de muziek als de speler actief is
    if (deviceId) {
      fetch(
        `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
    }

    // Verberg de swipe-knoppen
    document.getElementById("buttons").style.display = "none";

    // Vervang de kaart met een eindscherm met een samenvatting
    card.innerHTML = `
      <div class="done-state">
        <span class="done-icon">
          <img src="/images/spotify.svg" width="20px" height="auto" alt="Spotify">
        </span>
        <p class="done-title">Alle nummers zijn geweest</p>
        <p class="done-subtitle">${keptTracks.length} bewaard &middot; ${removedCount} verwijderd</p>
      </div>
    `;

    // Toon de opslaan- en terugknop
    document.getElementById("btn-save").style.display = "block";
    document.getElementById("btn-back").style.display = "block";
    return;
  }

  // Haal het huidige nummer op en vul de kaart in met de juiste info
  const track = tracks[currentIndex];
  document.getElementById("track-img").src = track.album.images[0]?.url ?? ""; // Album cover
  document.getElementById("track-name").innerText = track.name; // Naam van het nummer
  document.getElementById("track-artist").innerText = track.artists[0].name; // Naam van de artiest

  // Speel het nummer af
  playCurrentTrack();
}

// Start: haal de nummers op zodra de pagina geladen is
getPlaylistTracks();
