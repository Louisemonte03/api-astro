let tracks = [];
let currentIndex = 0;
const toRemove = [];
let currentAudio = null; // ← hier

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
    if (currentAudio) currentAudio.pause();
    return;
  }

  const track = tracks[currentIndex];
  document.getElementById("track-img").src = track.album.images[0]?.url ?? "";
  document.getElementById("track-name").innerText = track.name;
  document.getElementById("track-artist").innerText = track.artists[0].name;

  if (currentAudio) currentAudio.pause();
  if (track.preview_url) {
    currentAudio = new Audio(track.preview_url);
    currentAudio.volume = 0.5;
    currentAudio.play();
  }
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

// updating playlist

async function updatePlaylist() {
  const accessToken = localStorage.getItem("accessToken");
  const playlistId = new URLSearchParams(window.location.search).get("id");

  if (toRemove.length === 0) {
    alert("Geen tracks om te verwijderen!");
    return;
  }

  console.log("toRemove:", toRemove); // ← hier §

  const snapshotResponse = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  const snapshotData = await snapshotResponse.json();
  const snapshotId = snapshotData.snapshot_id;
  console.log("snapshot_id:", snapshotId); // ← hier

  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/items`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tracks: toRemove.map((track) => ({ uri: track.uri })),
      }),
    },
  );
  if (response.ok) {
    alert("Playlist bijgewerkt!");
  } else {
    const errorData = await response.json();
    console.log("Error details:", errorData);
  }
};

window.updatePlaylist = updatePlaylist;
