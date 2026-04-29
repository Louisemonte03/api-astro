// Spotify client ID: unieke identifier van jouw app in het Spotify Developer Dashboard
// Dit is publiek (geen secret), het hoeft niet verborgen te worden
const clientId = "5ee2c5425e034edbb2bc28779cc82aee";

// Hoofdfunctie die het volledige inlogproces regelt
// "export" maakt de functie beschikbaar voor andere bestanden die hem importeren (zoals index.astro)
// "async" zodat we "await" kunnen gebruiken voor API-verzoeken die tijd kosten
export const initSpotifyAuthentication = async (options) => {
  // Haal de redirectUri op uit het options-object dat meegegeven wordt bij het aanroepen
  const { redirectUri } = options;

  // Kijk of er een "code" in de URL staat — Spotify stuurt die mee na het inloggen
  // bijv. /callback?code=AQD...
  const code = getSearchParams("code");

  // Kijk of er al een access token opgeslagen is in de browser (van een eerdere sessie)
  let accessToken = localStorage.getItem("accessToken");

  if (!code) {
    // Geen code in de URL: de gebruiker heeft nog niet ingelogd via Spotify
    // Stuur ze door naar de Spotify inlogpagina
    redirectToAuthCodeFlow({ clientId, redirectUri });
  } else {
    if (!accessToken) {
      // Er is een code maar nog geen token: wissel de code in voor een access token
      // Dit is een eenmalige code die Spotify meegeeft na het inloggen
      accessToken = await getAccessToken(redirectUri, clientId, code);

      if (!accessToken) {
        // Iets ging mis bij het ophalen van het token (bijv. verlopen code)
        // Verwijder de verifier en stuur de gebruiker opnieuw naar Spotify om opnieuw in te loggen
        localStorage.removeItem("verifier");
        redirectToAuthCodeFlow({ clientId, redirectUri });
        return; // Stop de functie hier, de rest mag niet lopen
      }

      // Sla het token op in de browser zodat de gebruiker niet elke keer opnieuw hoeft in te loggen
      localStorage.setItem("accessToken", accessToken);

      // Haal de "?code=..." uit de URL zonder de pagina te herladen
      // Zonder dit staat de code nog in de URL en wordt hij opnieuw verwerkt bij een refresh
      window.history.replaceState({}, document.title, redirectUri);
    }

    // Haal de profielgegevens op via de Spotify API en toon ze op de pagina
    const profile = await fetchPersonalData(accessToken, "");
    populateUI(profile);

    // Haal de playlists op via de Spotify API en toon ze als kaartjes op de pagina
    const playlists = await fetchPersonalData(accessToken, "/playlists");
    populatePlaylists(playlists);
  }
};

// Genereer een willekeurige string van letters en cijfers als code verifier (stap 1 van PKCE)
// PKCE (Proof Key for Code Exchange) is een veiligheidslaag zodat niemand de code kan stelen
const generateCodeVerifier = (length) => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    // Math.random() geeft een getal tussen 0 en 1
    // Maal possible.length geeft een index in de lijst van tekens
    // Math.floor() rondt af naar beneden zodat het een geldig geheel getal is
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Zet de code verifier om naar een gehashte code challenge (stap 2 van PKCE)
// Spotify controleert later of de challenge overeenkomt met de verifier → bewijst dat wij de echte app zijn
const generateCodeChallenge = async (codeVerifier) => {
  // Zet de string om naar bytes zodat we hem kunnen hashen
  const data = new TextEncoder().encode(codeVerifier);

  // Hash de bytes met het SHA-256 algoritme (een eenrichtingsfunctie: je kunt niet terugrekenen)
  const digest = await window.crypto.subtle.digest("SHA-256", data);

  // Zet de hash om naar een Base64-string en maak hem URL-veilig
  // + wordt -, / wordt _, en = aan het einde wordt verwijderd
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

// Stuur de gebruiker door naar de Spotify inlogpagina met alle benodigde parameters
const redirectToAuthCodeFlow = async ({ clientId, redirectUri }) => {
  // Genereer de verifier en challenge voor PKCE
  const verifier = generateCodeVerifier(128); // 128 tekens lang voor maximale veiligheid
  const challenge = await generateCodeChallenge(verifier);

  // Sla de verifier op in de browser — we hebben hem later nodig bij het inwisselen van de code
  localStorage.setItem("verifier", verifier);

  // Bouw de URL op die de gebruiker naar Spotify stuurt
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code"); // We willen een code terug, geen direct token
  params.append("redirect_uri", redirectUri); // Hiernaar stuurt Spotify de gebruiker terug na inloggen
  params.append(
    "scope",
    // Scope = welke rechten de app vraagt aan de gebruiker
    // Elk woord is een apart recht: profiel lezen, playlists beheren, muziek afspelen, etc.
    "user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public streaming user-read-playback-state user-modify-playback-state",
  );
  params.append("code_challenge_method", "S256"); // S256 = SHA-256, de methode die we gebruiken
  params.append("code_challenge", challenge); // De gehashte versie van de verifier

  // Stuur de gebruiker door naar Spotify door de window.location te veranderen
  window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

// Wissel de tijdelijke code (uit de URL na inloggen) in voor een access token
// Het access token is wat we daarna bij elk API-verzoek meesturen
async function getAccessToken(redirectUri, clientId, code) {
  // Haal de verifier op die we eerder hebben opgeslagen — Spotify controleert dit
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code"); // Vertelt Spotify dat we een code inwisselen
  params.append("code", code); // De code die Spotify heeft meegestuurd in de URL
  params.append("redirect_uri", redirectUri); // Moet exact hetzelfde zijn als bij het inlogverzoek
  params.append("code_verifier", verifier); // Bewijs dat wij degene zijn die de code aanvroeg

  // POST-verzoek naar het Spotify token-endpoint
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" }, // Formaat dat Spotify verwacht
    body: params,
  });

  const data = await result.json();
  console.log("token response:", data); // Handig voor debugging: zie wat Spotify teruggeeft
  console.log("Granted scopes:", data.scope); // Controleer of alle gewenste rechten zijn verleend

  // Sla de verleende rechten op — handig als je later wil controleren of een recht beschikbaar is
  localStorage.setItem("grantedScopes", data.scope);

  // Geef het access token terug
  // Als het ophalen mislukt is, is data.access_token undefined en weet de aanroeper dat er iets fout ging
  return data.access_token;
}

// Hulpfunctie: haal een specifieke waarde op uit de URL parameters
// bijv. getSearchParams("code") op /callback?code=abc geeft "abc" terug
const getSearchParams = (param) => {
  const params = new URLSearchParams(window.location.search); // window.location.search = alles na "?"
  return params.get(param);
};

// Doe een verzoek naar de Spotify API op het /me endpoint (jouw eigen account)
// "path" is optioneel: "" = alleen profiel, "/playlists" = jouw playlists
async function fetchPersonalData(token, path) {
  const result = await fetch("https://api.spotify.com/v1/me" + path, {
    headers: { Authorization: `Bearer ${token}` }, // "Bearer" is het type token dat Spotify verwacht
  });
  return await result.json(); // Zet de JSON-respons om naar een JavaScript object
}

// Vul de profielgegevens in op de pagina door de HTML-elementen te zoeken op hun ID
function populateUI(profile) {
  document.getElementById("displayName").innerText = profile.display_name;
  document.getElementById("email").innerText = profile.email;

  // profile.images is een array van afbeeldingen (verschillende groottes)
  // We nemen de eerste afbeelding, of laten het leeg als er geen zijn
  document.getElementById("imgUrl").src = profile.images
    ? profile.images[0]?.url // ?. = optional chaining: geeft undefined terug als images[0] niet bestaat
    : "";
}

// Maak voor elke playlist een kaartje aan op de pagina
// We gebruiken een verborgen HTML-template zodat we de structuur niet in JS hoeven te schrijven
function populatePlaylists(playlists) {
  const section = document.getElementById("playlists"); // De container waar de kaartjes in komen
  const template = document.getElementById("playlist-template"); // Het verborgen template-element

  playlists.items.forEach((playlist) => {
    // cloneNode(true) maakt een volledige kopie van het template inclusief alle kinderen
    // Zo kunnen we het template hergebruiken voor elk playlist-kaartje
    const card = template.cloneNode(true);

    // Verwijder het ID van de kopie — anders hebben meerdere elementen hetzelfde ID
    // Twee elementen met hetzelfde ID is ongeldig HTML en veroorzaakt bugs
    card.removeAttribute("id");

    // Zet display op "" (leeg) om de standaard CSS-weergave te herstellen
    // Het template staat op display:none, de kopie moet zichtbaar zijn
    card.style.display = "";

    // Vul de gegevens van de playlist in op de juiste plekken in de kaart
    card.querySelector("img").src = playlist.images[0]?.url ?? ""; // Playlist-afbeelding
    card.querySelector("img").alt = playlist.name;
    card.querySelector(".card-name").innerText = playlist.name;

    // Stel de link in zodat klikken op de kaart naar de tracks-pagina gaat
    // encodeURIComponent zorgt dat speciale tekens in de naam (bijv. spaties, &) veilig in de URL staan
    card.querySelector("a").href =
      `/tracks?id=${playlist.id}&name=${encodeURIComponent(playlist.name)}`;

    // Voeg het ingevulde kaartje toe aan de pagina (onderaan de sectie)
    section.appendChild(card);
  });
}
