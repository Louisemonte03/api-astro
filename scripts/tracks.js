let tracks = [];
let keptTracks = [];
let currentIndex = 0;
let removedCount = 0;

const card = document.getElementById("track-card");
const SWIPE_THRESHOLD = 100;
const accessToken = localStorage.getItem("accessToken");
const playlistId = new URLSearchParams(window.location.search).get("id");

let startX = 0;
let dragX = 0;
let isDragging = false;

card.addEventListener("pointerdown", (e) => {
  isDragging = true;
  startX = e.clientX;
  dragX = 0;
  card.setPointerCapture(e.pointerId);
  card.style.animation = "none";
});

card.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  dragX = e.clientX - startX;
  card.style.transform = `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`;
});

card.addEventListener("pointerup", () => {
  if (!isDragging) return;
  isDragging = false;

  if (Math.abs(dragX) > SWIPE_THRESHOLD) {
    swipeCard(dragX > 0 ? "right" : "left");
  } else {
    card
      .animate(
        [
          { transform: `translateX(${dragX}px) rotate(${dragX * 0.05}deg)` },
          { transform: "translateX(0) rotate(0deg)" },
        ],
        { duration: 200, easing: "ease-out" },
      )
      .finished.then(() => {
        card.style.transform = "";
        card.style.animation = "";
      });
    dragX = 0;
  }
});

function swipeCard(direction) {
  const targetX =
    direction === "right" ? window.innerWidth * 1.5 : -window.innerWidth * 1.5;
  const rotation = direction === "right" ? 30 : -30;

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
        keptTracks.push(tracks[currentIndex]);
      } else {
        removedCount++;
      }
      currentIndex++;
      dragX = 0;
      showTrack();
    });
}

async function savePlaylist() {
  const btn = document.getElementById("btn-save");
  btn.disabled = true;
  btn.innerText = "Opslaan...";

  const uris = keptTracks.map((t) => t.uri);

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
    btn.innerText = "Opgeslagen!";
    btn.style.opacity = "0.6";
  } else {
    const err = await response.text();
    console.error("Opslaan mislukt:", response.status, err);
    btn.innerText = "Mislukt — probeer opnieuw";
    btn.disabled = false;
  }
}

document.getElementById("btn-reject").onclick = () => {
  dragX = 0;
  swipeCard("left");
};

document.getElementById("btn-keep").onclick = () => {
  dragX = 0;
  swipeCard("right");
};

async function getPlaylistTracks() {
  const playlistName = new URLSearchParams(window.location.search).get("name");
  document.getElementById("playlist-title").innerText = playlistName ?? "";

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
    console.error("Fout bij ophalen nummers:", response.status);
    return;
  }

  const data = await response.json();
  tracks = data.items.map((item) => item.item ?? item.track).filter(Boolean);

  showTrack();
}

function showTrack() {
  card.getAnimations().forEach((a) => a.cancel());
  card.style.transform = "";
  card.style.animation = "";

  if (currentIndex >= tracks.length) {
    document.getElementById("buttons").style.display = "none";
    card.innerHTML = `
      <div class="done-state">
        <span class="done-icon">
          <img src="/images/spotify.svg" width="20px" height="auto" alt="Spotify">
        </span>
        <p class="done-title">Alle nummers zijn geweest</p>
        <p class="done-subtitle">${keptTracks.length} bewaard &middot; ${removedCount} verwijderd</p>
      </div>
    `;
    document.getElementById("btn-save").style.display = "block";
    document.getElementById("btn-back").style.display = "block";
    return;
  }

  const track = tracks[currentIndex];
  document.getElementById("track-img").src = track.album.images[0]?.url ?? "";
  document.getElementById("track-name").innerText = track.name;
  document.getElementById("track-artist").innerText = track.artists[0].name;
}

getPlaylistTracks();
