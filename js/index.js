const musicContainer = document.querySelector(".music-container");
const currentSongName = document.querySelector(".song-name");
const currentSongArtist = document.querySelector(".song-artist");
const currentSongImage = document.querySelector(".song-cover");
const mainAudio = document.querySelector("#main-audio");
const inputToLoadSongs = document.querySelector("#input");
const uploadSongContainer = document.querySelector(".upload-song-container");
const playAndPauseButton = document.querySelector(".play-pause");
const previousMusicButton = document.querySelector("#prev");
const nextMusicButton = document.querySelector("#next");
const currentMusicProgressBar = document.querySelector(".progress-bar");
const progressBarArea = document.querySelector(".progress-area");

const arrayToLoadFiles = [];
let allSongs = [];
let currentSongIndex = 0;

/* --- EVENTOS --- */
inputToLoadSongs.addEventListener("change", (event) => {
  const file = event.target.files;
  arrayToLoadFiles.push(file);
  allSongs = arrayToLoadFiles[0];
  console.log(allSongs);
  initMusicPlayer();
  uploadSongContainer.classList.remove("upload-song-container");
  uploadSongContainer.classList.add("hidden");
  inputToLoadSongs.classList.add("hidden");
});

mainAudio.addEventListener("timeupdate", (e) => {
  const currentMusicTime = e.target.currentTime;
  const currentMusicDuration = e.target.duration;
  const musicCurrentTime = document.querySelector(".current");
  let currentProgress = (currentMusicTime / currentMusicDuration) * 100;
  currentMusicProgressBar.style.width = `${currentProgress}%`;

  mainAudio.addEventListener("loadeddata", () => {
    const musicDuration = document.querySelector(".duration");
    handleMusicTotalDuration(musicDuration);
  });

  handleMusicCurrentTime(musicCurrentTime);
});

mainAudio.addEventListener("ended", () => {
  handleNextMusic();
});

progressBarArea.addEventListener("click", (e) => {
  let progressWidthValue = progressBarArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let musicDuration = mainAudio.duration;

  if (progressWidthValue !== 0 && musicDuration !== 0) {
    mainAudio.currentTime = (clickedOffsetX / progressWidthValue) * musicDuration;
  }
});

playAndPauseButton.addEventListener("click", () => {
  const isMusicPaused = musicContainer.classList.contains("paused");
  isMusicPaused ? handlePauseMusic() : handlePlayMusic();
});

nextMusicButton.addEventListener("click", () => {
  handleNextMusic();
});

previousMusicButton.addEventListener("click", () => {
  handlePreviousMusic();
});

/* --- EVENTOS --- */

/* --- FUNCIONES DEL REPRODUCTOR --- */

const initMusicPlayer = () => {
  loadMusic();
};

const loadMusic = () => {
  jsmediatags.read(allSongs[currentSongIndex], {
    onSuccess: function (tag) {
      const { data, format } = tag.tags.picture;
      let base64String = "";

      for (let i = 0; i < data.length; i++) {
        base64String += String.fromCharCode(data[i]);
      }

      currentSongImage.src = `data:${data.format};base64,${window.btoa(
        base64String
      )}`;

      currentSongName.innerText = tag.tags.title;
      currentSongArtist.innerText = tag.tags.artist;
    },
    onError: function (error) {
      currentSongImage.src = "img/no-cover.png";
      currentSongName.innerText = allSongs[currentSongIndex]?.name;
      currentSongArtist.innerText = "No artist";
    },
  });

  mainAudio.src = `songs/${allSongs[currentSongIndex]?.name}`;
};

const handlePlayMusic = () => {
  musicContainer.classList.add("paused");
  currentSongImage.classList.add("play");
  playAndPauseButton.querySelector("i").innerHTML = "pause";
  mainAudio.play();
};

const handlePauseMusic = () => {
  musicContainer.classList.remove("paused");
  currentSongImage.classList.remove("play");
  playAndPauseButton.querySelector("i").innerHTML = "play_arrow";
  mainAudio.pause();
};

const handleNextMusic = () => {
  currentSongIndex++;
  if (currentSongIndex > allSongs.length - 1) {
    currentSongIndex = 0;
  } else {
    currentSongIndex = currentSongIndex;
  }
  loadMusic(currentSongIndex);
  handlePlayMusic();
};

const handlePreviousMusic = () => {
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = allSongs.length - 1;
  } else {
    currentSongIndex = currentSongIndex;
  }
  loadMusic(currentSongIndex);
  handlePlayMusic();
};

const handleMusicTotalDuration = (musicDuration) => {
  let audioDuration = mainAudio.duration;
  let totalMin = Math.floor(audioDuration / 60);
  let totalSec = Math.floor(audioDuration % 60);
  if (totalSec < 10) {
    totalSec = `0${totalSec}`;
  }
  musicDuration.innerText = `${totalMin}:${totalSec}`;
};

const handleMusicCurrentTime = (musicCurrentTime) => {
  let audioDuration = mainAudio.currentTime;
  let currentMin = Math.floor(audioDuration / 60);
  let currentSec = Math.floor(audioDuration % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
};

/* --- FUNCIONES DEL REPRODUCTOR --- */
