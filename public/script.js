// Bron: Spotify Authorization Code + PKCE Flow
// https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

const clientId = "5ee2c5425e034edbb2bc28779cc82aee";

export const initSpotifyAuthentication = async (options) => {
  const { redirectUri } = options;
  const code = getSearchParams("code");
  let accessToken = localStorage.getItem("accessToken");

  if (!code) {
    redirectToAuthCodeFlow({ clientId, redirectUri });
  } else {
    if (!accessToken) {
      accessToken = await getAccessToken(redirectUri, clientId, code);

      if (!accessToken) {
        localStorage.removeItem("verifier");
        redirectToAuthCodeFlow({ clientId, redirectUri });
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      window.history.replaceState({}, document.title, redirectUri);
    }

    const profile = await fetchPersonalData(accessToken, "");
    populateUI(profile);

    const playlists = await fetchPersonalData(accessToken, "/playlists");
    populatePlaylists(playlists);
  }
};

const generateCodeVerifier = (length) => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const generateCodeChallenge = async (codeVerifier) => {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const redirectToAuthCodeFlow = async ({ clientId, redirectUri }) => {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", redirectUri);
  params.append(
    "scope",
    "user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public streaming user-read-playback-state user-modify-playback-state",
  );
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

async function getAccessToken(redirectUri, clientId, code) {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  params.append("code_verifier", verifier);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const data = await result.json();
  console.log("token response:", data);
  console.log("Granted scopes:", data.scope);

  localStorage.setItem("grantedScopes", data.scope);
  return data.access_token;
}

const getSearchParams = (param) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
};

async function fetchPersonalData(token, path) {
  const result = await fetch("https://api.spotify.com/v1/me" + path, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await result.json();
}

function populateUI(profile) {
  document.getElementById("displayName").innerText = profile.display_name;
  document.getElementById("email").innerText = profile.email;
  document.getElementById("imgUrl").src = profile.images
    ? profile.images[0]?.url
    : "";
}

function populatePlaylists(playlists) {
  const section = document.getElementById("playlists");
  const template = document.getElementById("playlist-template");

  playlists.items.forEach((playlist) => {
    const card = template.cloneNode(true);
    card.removeAttribute("id");
    card.style.display = "";
    card.querySelector("img").src = playlist.images[0]?.url ?? "";
    card.querySelector("img").alt = playlist.name;
    card.querySelector(".card-name").innerText = playlist.name;
    card.querySelector("a").href =
      `/tracks?id=${playlist.id}&name=${encodeURIComponent(playlist.name)}`;
    section.appendChild(card);
  });
}
