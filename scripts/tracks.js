let tracks = [];
let currentIndex = 0;
const toRemove = [];
let currentAudio = null;

const card = document.getElementById("track-card");
const SWIPE_THRESHOLD = 100;

let startX = 0;
let dragX = 0;
let isDragging = false;

// Pointer Events — detecteert slepen op muis én touch
card.addEventListener("pointerdown", (e) => {
  isDragging = true;
  startX = e.clientX;
  dragX = 0;
  card.setPointerCapture(e.pointerId);
  card.style.animation = "none"; // float pauzeren tijdens slepen
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
    // Web Animations — kaart terug naar midden
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
        card.style.animation = ""; // float hervatten
      });
    dragX = 0;
  }
});

// Web Animations — kaart vliegt weg naar links of rechts
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
      if (direction === "left") toRemove.push(tracks[currentIndex]);
      currentIndex++;
      dragX = 0;
      showTrack();
    });
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
  card.getAnimations().forEach((a) => a.cancel()); // WAAPI fill resetten
  card.style.transform = "";
  card.style.animation = ""; // float hervatten voor nieuwe kaart

  if (currentIndex >= tracks.length) {
    if (currentAudio) currentAudio.pause();
    document.getElementById("buttons").style.display = "none";
    card.innerHTML = `
      <div class="done-state">
      <span class="done-icon">
  <img src="public/images/spotify.svg" width="20px" height="auto" alt="done">
</span>
        <p class="done-title">Alle nummers zijn geweest</p>
        <p class="done-subtitle">${toRemove.length} nummer${toRemove.length !== 1 ? "s" : ""} gemarkeerd om te verwijderen</p>
      </div>
    `;
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

getPlaylistTracks();
