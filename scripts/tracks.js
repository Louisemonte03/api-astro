let tracks = [];
let currentIndex = 0;
const toRemove = [];

async function getPlaylistTracks() {
  const accessToken = localStorage.getItem("accessToken");
  const playlistId = new URLSearchParams(window.location.search).get("id");
  const playlistName = new URLSearchParams(window.location.search).get("name");

  document.getElementById("playlist-title").innerText = playlistName;

  if (!accessToken || !playlistId) {
    console.error("Geen token of playlist ID gevonden");
    return;
  }

  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/items?limit=50`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!response.ok) {
    console.error("Fout:", response.status);
    return;
  }

  const data = await response.json();
  tracks = data.items.map((item) => item.item ?? item.track).filter(Boolean);

  showTrack();
}

function showTrack() {
  if (currentIndex >= tracks.length) {
    document.getElementById("track-card").innerText = "Klaar!";
    return;
  }

  const track = tracks[currentIndex];
  document.getElementById("track-img").src = track.album.images[0]?.url ?? "";
  document.getElementById("track-name").innerText = track.name;
  document.getElementById("track-artist").innerText = track.artists[0].name;
}

document.getElementById("btn-reject").onclick = () => {
  toRemove.push(tracks[currentIndex]);
  currentIndex++;
  showTrack();
};

document.getElementById("btn-keep").onclick = () => {
  currentIndex++;
  showTrack();
};

getPlaylistTracks();
