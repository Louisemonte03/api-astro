/* MARK: inlog documenta
 */

// code van spotify documentatie

const clientId = "5ee2c5425e034edbb2bc28779cc82aee";
const redirectUri = "http://127.0.0.1:4321/callback";

const params = new URLSearchParams(window.location.search);
const code = params.get("code");

console.log(code);

if (!code) {
  redirectToAuthCodeFlow(clientId);
} else {
  const accessToken = await getAccessToken(clientId, code);
  console.log(accessToken);
  //....
  const profile = await fetchProfile(accessToken);
  populateUI(profile);
  console.log(profile);
}

async function redirectToAuthCodeFlow(clientId) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);
  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", redirectUri);
  params.append(
    "scope",
    "user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public",
  );
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getAccessToken(clientId, code) {
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

  const { access_token } = await result.json();
  return access_token;
}

async function fetchProfile(token) {
  const result = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await result.json();
}

function populateUI(profile) {
  document.getElementById("profile").style.display = "block";
  document.getElementById("displayName").innerText = profile.display_name;
  document.getElementById("email").innerText = profile.email;
  document.getElementById("id").innerText = profile.id;
  document.getElementById("imgUrl").src = profile.images[0].url;
  console.log(profile);
}

// code van Jad voor de playlist

//   code van jad voor de local storage
