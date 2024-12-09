let words = [
  ["ate", "brother", "dad"],
  ["fire", "rice", "bed"],
  ["bee", "beg", "call"],
  ["cake", "car", "chair"],
  ["color", "dog", "fat"]
];

let correctWord;
let currentRound = 0;
let maxRounds = 5;
let audio, applauseSound, disappointedSound;
let startTime, elapsedTime, timerInterval;

function preload() {
  audio = {
    "ate": loadSound("ate.mp3"),
    "brother": loadSound("brother.mp3"),
    "dad": loadSound("dad.mp3"),
    "fire": loadSound("fire.mp3"),
    "rice": loadSound("rice.mp3"),
    "bed": loadSound("bed.mp3"),
    "bee": loadSound("bee.mp3"),
    "beg": loadSound("beg.mp3"),
    "call": loadSound("call.mp3"),
    "cake": loadSound("cake.mp3"),
    "car": loadSound("car.mp3"),
    "chair": loadSound("chair.mp3"),
    "color": loadSound("color.mp3"),
    "dog": loadSound("dog.mp3"),
    "fat": loadSound("fat.mp3"),
  };
  applauseSound = loadSound("applause.mp3");
  disappointedSound = loadSound("disappointed.mp3");
}

function setup() {
  noCanvas();
}

function showTooltip() {
  const tooltip = document.getElementById("tooltip");
  tooltip.innerHTML = `
    <strong>Grading Instructions:</strong><br>
    <em>Time-Based Grading:</em>
    <ul>
      <li>0 - 20 seconds: 100%</li>
      <li>21 - 60 seconds: 80%</li>
      <li>61 - 90 seconds: 70%</li>
      <li>91 - 120 seconds: 60%</li>
      <li>121 - 180 seconds: 50%</li>
      <li>181 - 240 seconds: 40%</li>
      <li>241 - 300 seconds: 30%</li>
      <li>301 - 360 seconds: 20%</li>
      <li>361+ seconds: 10%</li>
    </ul>
    <em>Note:</em> Try to finish as quickly as possible for the best grade!
  `;
  tooltip.style.display = "block";
  // Position tooltip to the right of the button
  const btnBounds = document.getElementById('attemptButton').getBoundingClientRect();
  tooltip.style.top = `${btnBounds.top + window.scrollY}px`;
  tooltip.style.left = `${btnBounds.right + 10}px`;
}

function hideTooltip() {
  const tooltip = document.getElementById("tooltip");
  tooltip.style.display = "none";
}

function startAttempt() {
  currentRound = 0;
  document.getElementById('attemptButton').classList.add('hidden');
  document.getElementById('stopwatch').innerText = "Time: 00:00";
  startTime = Date.now();
  timerInterval = setInterval(updateStopwatch, 100);
  loadNewSet();
}

function loadNewSet() {
  if (currentRound >= maxRounds) {
    endGame();
    return;
  }

  correctWord = random(words[currentRound]);
  document.getElementById("audio-word").innerText = correctWord;

  let cards = shuffle([...words[currentRound]]);
  cards.forEach((word, i) => {
    document.getElementById(`card-${i + 1}`).innerText = word;
  });
}

function playSound() {
  if (audio[correctWord]) audio[correctWord].play();
}

function checkWord(index) {
  let selectedWord = document.getElementById(`card-${index + 1}`).innerText;
  let card = document.getElementById(`card-${index + 1}`);

  if (selectedWord === correctWord) {
    card.classList.add('correct');
    applauseSound.play();
    setTimeout(() => {
      card.classList.remove('correct');
      nextRound();
    }, 1000);
  } else {
    card.classList.add('wrong');
    disappointedSound.play();
    setTimeout(() => card.classList.remove('wrong'), 1000);
  }
}

function nextRound() {
  currentRound++;
  loadNewSet();
}

function updateStopwatch() {
  elapsedTime = Date.now() - startTime;
  let seconds = Math.floor(elapsedTime / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds %= 60;

  document.getElementById("stopwatch").innerText = `Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function endGame() {
  clearInterval(timerInterval);  // Stop the timer
  calculateGrade();
}

function calculateGrade() {
  let grade = 0;
  let success = true;
  clearInterval(timerInterval); // Stop the timer

  if (elapsedTime <= 20000) { // 20 seconds
    grade = 100;
  } else if (elapsedTime <= 60000) { // 1 minute
    grade = 80;
  } else if (elapsedTime <= 90000) { // 1 min 30 sec
    grade = 70;
  } else if (elapsedTime <= 120000) { // 2 minutes
    grade = 60;
  } else if (elapsedTime <= 180000) { // 3 minutes
    grade = 50;
  } else if (elapsedTime <= 240000) { // 4 minutes
    grade = 40;
  } else if (elapsedTime <= 300000) { // 5 minutes
    grade = 30;
  } else if (elapsedTime <= 360000) { // 6 minutes
    grade = 20;
  } else {
    grade = 10; // 7 minutes or more
  }

  endAttempt(grade);
}

function endAttempt(grade) {
  let resultMessage = document.getElementById("resultMessage");
  resultMessage.innerText = grade >= 50 
    ? `Well Done!! 🎉👏 (${grade}%)` 
    : `Better Luck Next Time 😞 (${grade}%)`;

  if (grade >= 50) applauseSound.play();
  else disappointedSound.play();

  document.getElementById('end-screen').classList.remove('hidden');
  document.getElementById('playAgain').classList.remove('hidden');
}

function restartGame() {
  currentRound = 0;
  elapsedTime = 0;
  document.getElementById('end-screen').classList.add('hidden');
  document.querySelector('.word-cards').classList.remove('hidden');
  document.getElementById('attemptButton').classList.remove('hidden');
  document.getElementById('playAgain').classList.add('hidden');
}
