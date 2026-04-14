const playlistId = window.location.pathname.split("/")[2];
const accessToken = localStorage.getItem("accessToken");

console.log("pathname:", window.location.pathname);
console.log("playlistId:", playlistId);
console.log("accessToken:", accessToken);

const res = await fetch(
  `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
  {
    headers: { Authorization: `Bearer ${accessToken}` },
  },
);

const data = await res.json();
console.log(data);
const tracks = data.items.map((item) => item.track);

console.log(tracks);

console.log(data); // wat zegt de error message?
