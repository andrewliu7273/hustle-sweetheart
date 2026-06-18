const voicePlayer = document.querySelector("#voicePlayer");
const playPauseButton = document.querySelector("#playPauseButton");
const stopButton = document.querySelector("#stopButton");
const progressSlider = document.querySelector("#progressSlider");
const currentTimeLabel = document.querySelector("#currentTime");
const durationLabel = document.querySelector("#duration");
const audioStatus = document.querySelector("#audioStatus");
const quizPanel = document.querySelector("#quizPanel");
const unlockedPanel = document.querySelector("#unlockedPanel");
const quizCount = document.querySelector("#quizCount");
const quizQuestion = document.querySelector("#quizQuestion");
const answerBlanks = document.querySelector("#answerBlanks");
const answerForm = document.querySelector("#answerForm");
const answerInput = document.querySelector("#answerInput");
const quizFeedback = document.querySelector("#quizFeedback");

let isDragging = false;
let currentQuestionIndex = 0;
const audioSources = ["media/voice-recording.mp3", "voice-recording.mp3"];
const questions = [
  {
    prompt: "What does Adri need to work on the most?",
    answer: "pride",
    comment: "mmm yes adri does have a lot of pride"
  },
  {
    prompt: "What is Adri's favorite meat in the whole world?",
    answer: "steak",
    comment: "she does love steak, specifically ribeye"
  },
  {
    prompt: "What does Adri need to do to get a free Lululemon jacket?",
    answer: "marathon",
    comment: "she promised"
  },
  {
    prompt: "Why does Adri want to go to Shanghai?",
    answer: "disneyland",
    comment: "and for food but i think mostly disneyland"
  },
  {
    prompt: "What is the most important thing to Adri?",
    answer: "andrew",
    comment: "that is correct!"
  }
];

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

function normalizeAnswer(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function renderQuestion() {
  const question = questions[currentQuestionIndex];
  quizCount.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  quizQuestion.textContent = question.prompt;
  answerBlanks.replaceChildren();

  for (let index = 0; index < question.answer.length; index += 1) {
    answerBlanks.append(document.createElement("span"));
  }

  answerInput.value = "";
  answerInput.maxLength = question.answer.length + 8;
  quizFeedback.textContent = "";
  answerInput.focus();
}

function unlockPlayer() {
  quizPanel.hidden = true;
  unlockedPanel.hidden = false;
  voicePlayer.src = audioSources[0];
  voicePlayer.load();
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = questions[currentQuestionIndex];
  const isCorrect = normalizeAnswer(answerInput.value) === question.answer;

  if (!isCorrect) {
    quizFeedback.textContent = "Not quite. Try again.";
    answerInput.select();
    return;
  }

  quizFeedback.textContent = question.comment;
  currentQuestionIndex += 1;

  if (currentQuestionIndex >= questions.length) {
    window.setTimeout(unlockPlayer, 900);
    return;
  }

  window.setTimeout(renderQuestion, 1100);
});

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
  const currentIndex = audioSources.indexOf(voicePlayer.getAttribute("src"));
  const nextSource = audioSources[currentIndex + 1];

  if (nextSource) {
    voicePlayer.src = nextSource;
    voicePlayer.load();
    return;
  }

  setStatus("Voice recording file not added yet.");
});

if (voicePlayer.readyState > 0) {
  setStatus("Voice recording ready.", true);
  updateProgress();
}

renderQuestion();
