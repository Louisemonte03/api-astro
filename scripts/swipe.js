const container = document.getElementById("swipe-container");
const playlistId = container.dataset.playlistId;
const accessToken = localStorage.getItem("accessToken");

const testRes = await fetch("https://api.spotify.com/v1/me", {
  headers: { Authorization: `Bearer ${accessToken}` },
});

if (testRes.status === 401) {
  localStorage.clear();
  window.location.href = "/";
  throw new Error("Token verlopen, opnieuw inloggen");
}

if (!accessToken) {
  window.location.href = "/";
  throw new Error("Geen token");
}

console.log("playlistId:", playlistId);
console.log("accessToken:", accessToken);

const res = await fetch(
  `https://api.spotify.com/v1/playlists/${playlistId}/items?market=NL`,
  {
    headers: { Authorization: `Bearer ${accessToken}` },
  },
);

const data = await res.json();
console.log("response:", data);

if (data.error) {
  console.error("Spotify error:", data.error.message);
} else {
  const tracks = data.items.map((item) => item.track);
  console.log("tracks:", tracks);
}
