const voicePlayer = document.querySelector("#voicePlayer");
const playPauseButton = document.querySelector("#playPauseButton");
const stopButton = document.querySelector("#stopButton");
const progressSlider = document.querySelector("#progressSlider");
const currentTimeLabel = document.querySelector("#currentTime");
const durationLabel = document.querySelector("#duration");
const audioStatus = document.querySelector("#audioStatus");

let isDragging = false;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function setStatus(message, isReady = false) {
  audioStatus.textContent = message;
  audioStatus.dataset.ready = String(isReady);
}

function updateProgress() {
  const duration = voicePlayer.duration || 0;
  const current = voicePlayer.currentTime || 0;

  if (!isDragging) {
    progressSlider.value = duration ? String((current / duration) * 100) : "0";
  }

  currentTimeLabel.textContent = formatTime(current);
  durationLabel.textContent = formatTime(duration);
}

function stopAudio() {
  voicePlayer.pause();
  voicePlayer.currentTime = 0;
  playPauseButton.textContent = "Play";
  updateProgress();
}

playPauseButton.addEventListener("click", async () => {
  if (voicePlayer.paused) {
    try {
      await voicePlayer.play();
      playPauseButton.textContent = "Pause";
    } catch {
      setStatus("Add the voice recording first.");
    }
  } else {
    voicePlayer.pause();
    playPauseButton.textContent = "Play";
  }
});

stopButton.addEventListener("click", stopAudio);

progressSlider.addEventListener("input", () => {
  isDragging = true;
  const duration = voicePlayer.duration || 0;
  const nextTime = duration * (Number(progressSlider.value) / 100);
  currentTimeLabel.textContent = formatTime(nextTime);
});

progressSlider.addEventListener("change", () => {
  const duration = voicePlayer.duration || 0;
  voicePlayer.currentTime = duration * (Number(progressSlider.value) / 100);
  isDragging = false;
  updateProgress();
});

voicePlayer.addEventListener("loadedmetadata", () => {
  setStatus("Voice recording ready.", true);
  updateProgress();
});

voicePlayer.addEventListener("timeupdate", updateProgress);

voicePlayer.addEventListener("ended", () => {
  playPauseButton.textContent = "Play";
  updateProgress();
});

voicePlayer.addEventListener("error", () => {
  setStatus("Voice recording file not added yet.");
});

if (voicePlayer.readyState > 0) {
  setStatus("Voice recording ready.", true);
  updateProgress();
}
