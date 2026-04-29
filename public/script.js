// Spotify client ID: unieke identifier van jouw app in het Spotify Developer Dashboard
const clientId = "5ee2c5425e034edbb2bc28779cc82aee";

// Hoofdfunctie die het volledige inlogproces regelt
// Wordt aangeroepen vanuit index.astro en callback.astro met de redirect URI
export const initSpotifyAuthentication = async (options) => {
  const { redirectUri } = options;

  // Kijk of er een "code" in de URL staat (Spotify stuurt die mee na inloggen)
  const code = getSearchParams("code");

  // Kijk of er al een access token opgeslagen is in de browser
  let accessToken = localStorage.getItem("accessToken");

  if (!code) {
    // Geen code in de URL: de gebruiker is nog niet ingelogd, stuur ze naar Spotify
    redirectToAuthCodeFlow({ clientId, redirectUri });
  } else {
    if (!accessToken) {
      // Wel een code maar nog geen token: wissel de code in voor een access token
      accessToken = await getAccessToken(redirectUri, clientId, code);

      if (!accessToken) {
        // Token ophalen mislukt: verwijder de oude verifier en stuur opnieuw naar Spotify
        localStorage.removeItem("verifier");
        redirectToAuthCodeFlow({ clientId, redirectUri });
        return;
      }

      // Sla het token op in de browser zodat het hergebruikt kan worden
      localStorage.setItem("accessToken", accessToken);

      // Verwijder de "?code=..." uit de URL zonder de pagina te herladen
      window.history.replaceState({}, document.title, redirectUri);
    }

    // Haal de profielgegevens op en toon ze in de HTML
    const profile = await fetchPersonalData(accessToken, "");
    populateUI(profile);

    // Haal de playlists op en toon ze in de HTML
    const playlists = await fetchPersonalData(accessToken, "/playlists");
    populatePlaylists(playlists);
  }
};

// Genereer een willekeurige string die gebruikt wordt als code verifier (stap 1 van PKCE)
const generateCodeVerifier = (length) => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Zet de code verifier om naar een gehashte code challenge (stap 2 van PKCE)
// PKCE is een veilige manier om in te loggen zonder een client secret te gebruiken
const generateCodeChallenge = async (codeVerifier) => {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data); // Hash met SHA-256
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, ""); // Maak de hash URL-veilig
};

// Stuur de gebruiker door naar de Spotify inlogpagina
const redirectToAuthCodeFlow = async ({ clientId, redirectUri }) => {
  // Genereer een code verifier en sla die op (nodig later bij het inwisselen van de code)
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);
  localStorage.setItem("verifier", verifier);

  // Bouw de URL op met alle benodigde parameters voor Spotify
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", redirectUri); // Hiernaar stuurt Spotify terug na inloggen
  params.append(
    "scope",
    // Welke rechten de app nodig heeft (profiel lezen, playlists beheren, muziek afspelen)
    "user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public streaming user-read-playback-state user-modify-playback-state",
  );
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  // Stuur de gebruiker door naar Spotify
  window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

// Wissel de tijdelijke code (uit de URL) in voor een access token bij Spotify
async function getAccessToken(redirectUri, clientId, code) {
  // Haal de code verifier op die eerder opgeslagen is
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code); // De code die Spotify heeft meegestuurd in de URL
  params.append("redirect_uri", redirectUri);
  params.append("code_verifier", verifier); // Bewijs dat wij dezelfde app zijn die de code aanvroeg

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const data = await result.json();
  console.log("token response:", data);
  console.log("Granted scopes:", data.scope);

  // Sla de verleende rechten op (handig voor debugging)
  localStorage.setItem("grantedScopes", data.scope);

  // Geef het access token terug (of undefined als het mislukt is)
  return data.access_token;
}

// Haal een specifieke waarde op uit de URL parameters
const getSearchParams = (param) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
};

// Doe een verzoek naar de Spotify API op het /me endpoint (jouw eigen profiel)
// Het "path" argument is optioneel, bijv. "/playlists" voor jouw playlists
async function fetchPersonalData(token, path) {
  const result = await fetch("https://api.spotify.com/v1/me" + path, {
    headers: { Authorization: `Bearer ${token}` }, // Stuur het token mee als bewijs
  });
  return await result.json();
}

// Vul de profielgegevens in op de pagina
function populateUI(profile) {
  document.getElementById("displayName").innerText = profile.display_name; // Naam
  document.getElementById("email").innerText = profile.email; // E-mailadres
  document.getElementById("imgUrl").src = profile.images
    ? profile.images[0]?.url // Profielafbeelding (eerste in de lijst)
    : "";
}

// Maak voor elke playlist een kaartje aan op de pagina op basis van een HTML template
function populatePlaylists(playlists) {
  const section = document.getElementById("playlists");
  const template = document.getElementById("playlist-template");

  playlists.items.forEach((playlist) => {
    // Kopieer het verborgen template-element
    const card = template.cloneNode(true);
    card.removeAttribute("id"); // Verwijder het template ID zodat er geen duplicaten zijn
    card.style.display = ""; // Maak het kaartje zichtbaar

    // Vul de gegevens van de playlist in
    card.querySelector("img").src = playlist.images[0]?.url ?? "";
    card.querySelector("img").alt = playlist.name;
    card.querySelector(".card-name").innerText = playlist.name;

    // Klik op het kaartje gaat naar de tracks-pagina met het ID en naam in de URL
    card.querySelector("a").href =
      `/tracks?id=${playlist.id}&name=${encodeURIComponent(playlist.name)}`;

    // Voeg het kaartje toe aan de pagina
    section.appendChild(card);
  });
}
