import { listen, select } from './utils.js';

'use strict';

const countdownElement = select('.countdown');
const wordElement = select('.word');
const hitsElement = select('.hits');
const inputElement = select('input');
const startButtonElement = select('.start-button');
const volumeHighElement = select('.fa-volume-high');
const volumeXmarkElement = select('.fa-volume-xmark');
const leaderboardContentElement = select('.leaderboard-content');

// For testing
// const words = [
//   'dinosaur', 'love'
// ];

const words = [
  'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 
  'population', 'weather', 'bottle', 'history', 'dream', 'character', 
  'money', 'absolute', 'discipline', 'machine', 'accurate', 'connection', 
  'rainbow', 'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 
  'developer', 'philosophy', 'database', 'periodic', 'capitalism', 
  'abominable', 'component', 'future', 'pasta', 'microwave', 'jungle', 
  'wallet', 'canada', 'coffee', 'monstrosity', 'abomination', 'brazil', 
  'eleven', 'technology', 'alphabet', 'knowledge', 'magician', 'professor', 
  'triangle', 'earthquake', 'baseball', 'beyond', 'evolution', 'banana', 
  'perfumer', 'computer', 'management', 'discovery', 'ambition', 'music', 
  'eagle', 'crown', 'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 
  'button', 'superman', 'library', 'unboxing', 'bookstore', 'language', 
  'homework', 'fantastic', 'economy', 'interview', 'awesome', 'challenge', 
  'science', 'mystery', 'famous', 'league', 'memory', 'leather', 'planet', 
  'software', 'update', 'yellow', 'keyboard', 'window'
];

// For testing
const INITIAL_COUNTDOWN = 20;

// const INITIAL_COUNTDOWN = 99;


// For test (clears localStorage data)
// localStorage.clear();

window.onload = function() {
  countdownElement.textContent = INITIAL_COUNTDOWN;
  inputElement.value = '';
  wordElement.textContent = 'GET READY';
  scores = JSON.parse(localStorage.getItem('scores')) || [];
  updateLeaderboard();
};

inputElement.disabled = true;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let wordsCopy = [...words];
shuffle(wordsCopy);

wordElement.textContent = wordsCopy[0].toUpperCase();

let countdownInterval = null;

let gameStarted = false;

const backgroundMusic = new Audio('assets/media/music.mp3');
backgroundMusic.volume = 0.4;

let audioContext;
let audioSource;
let analyser;
let bufferLength;
let dataArray;



function stopMusicPlayback() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}

function resetGame() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    stopMusicPlayback();
  }
  wordsCopy = [...words];
  shuffle(wordsCopy);
}

function startCountdown() {
  let countdown = INITIAL_COUNTDOWN;
  countdownElement.textContent = countdown;

  countdownInterval = setInterval(() => {
    countdown--;
    countdownElement.textContent = countdown;

    if (countdown === 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  countdownElement.textContent = `${INITIAL_COUNTDOWN}`;
  clearInterval(countdownInterval);
  gameStarted = false;
  startButtonElement.textContent = 'RESTART';
  inputElement.value = '';
  inputElement.disabled = true;
  inputElement.placeholder = "Click start to type";
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  addScore(hits, 0, new Date().toLocaleDateString());
}

function resetHits() {
  hits = 0;
  hitsElement.textContent = `Hits: ${hits}`;
}

function setupGameState() {
  inputElement.value = '';
  inputElement.focus();
  gameStarted = true;
  startButtonElement.textContent = 'RESTART';
  inputElement.placeholder = '';
}

function initializeAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioSource = audioContext.createMediaElementSource(backgroundMusic);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    draw();
  }
}

function startMusicPlayback() {
  backgroundMusic.play().catch(error => console.error("Audio playback error: ", error));
}

function startGame() {
  setupGameState();
  initializeAudioContext();
  startMusicPlayback();
  inputElement.disabled = false;
  inputElement.focus();
  wordElement.textContent = wordsCopy[0].toUpperCase();
}

listen('click', startButtonElement, async () => {
  resetGame();
  startGame();
  startCountdown();
  resetHits();
});

let hits = 0;

// Input methods and listener

const updateWordElement = (correctLetters, remainingLetters) => {
  wordElement.innerHTML = 
    `<span class="correct-letter">${correctLetters}</span>${remainingLetters}`;
};

const processCorrectInput = () => {
  wordsCopy.shift();
  wordElement.textContent = wordsCopy.length > 0 ? wordsCopy[0].toUpperCase() : '';
  inputElement.value = '';
  hits++;
  hitsElement.textContent = `Hits: ${hits}`;
};

const whenPlayerWins = () => {
  clearInterval(countdownInterval);
  stopMusicPlayback();
  wordElement.textContent = "YOU WIN!";
  inputElement.disabled = true;
  inputElement.placeholder = "Click start to type";
  addScore(hits, 0, new Date().toLocaleDateString());
};

listen('input', inputElement, () => {
  if (gameStarted && wordsCopy.length > 0) {
    const inputText = inputElement.value.toUpperCase();
    const currentWord = wordsCopy[0].toUpperCase();

    if (currentWord.startsWith(inputText)) {
      const correctLetters = currentWord.slice(0, inputText.length);
      const remainingLetters = currentWord.slice(inputText.length);
      updateWordElement(correctLetters, remainingLetters);
    }

    if (inputText === currentWord) {
      processCorrectInput(); 
      if (wordsCopy.length === 0) {
        whenPlayerWins();
      }
    }
  }
});

// Mute/unmute buttons

volumeHighElement.style.display = 'none';

listen('click', volumeHighElement, () => {
  backgroundMusic.muted = false;
  volumeHighElement.style.display = 'none';
  volumeXmarkElement.style.display = 'inline-block';
});

listen('click', volumeXmarkElement, () => {
  backgroundMusic.muted = true;
  volumeXmarkElement.style.display = 'none';
  volumeHighElement.style.display = 'inline-block';
});

/*************************
 *       Leaderboard     *
 *************************/
const leaderboardIcon = select('.leaderboard-icon');
const leaderboard = select('.leaderboard');

listen('click', leaderboardIcon, () => {
  leaderboard.classList.toggle('leaderboard-visible');
});

let scores = JSON.parse(localStorage.getItem('scores')) || [];

function makeScoreObject(hits, percentage, date) {
  return {
    hits: hits,
    percentage: percentage,
    date: date,
    getHits: function() {
      return this.hits;
    },
    getPercentage: function() {
      return this.percentage;
    },
    getDate: function() {
      return this.date;
    }
  };
}


function addScore(hits, percentage, date) {
  let score = makeScoreObject(hits, percentage, date);
  /* If the leaderboard isn't empty. Only add a new score if 
  the score is higher than the lowest score on the leaderboard.
  That is, only add a new score when you get a better score. */
  if (scores.length === 0 || hits > scores[scores.length - 1].hits) {
    scores.push(score);
    scores.sort((a, b) => b.hits - a.hits);

    if (scores.length > 10) {
      scores.splice(10);
    }

    localStorage.setItem('scores', JSON.stringify(scores));
    updateLeaderboard();
  }
}

function createLeaderboardItem(score, index) {
  const li = document.createElement('li');
  li.className = 'leaderboard-item';

  const rankSpan = document.createElement('span');
  rankSpan.className = 'rank';
  rankSpan.textContent = `#${index + 1}`;
  li.appendChild(rankSpan);

  const hitsSpan = document.createElement('span');
  hitsSpan.className = 'hits';
  hitsSpan.textContent = score.hits;
  li.appendChild(hitsSpan);

  const dateSpan = document.createElement('span');
  dateSpan.className = 'date';
  dateSpan.textContent = score.date;
  li.appendChild(dateSpan);

  return li;
}

function updateLeaderboard() {
  leaderboardContentElement.innerHTML = '';

  if (scores.length === 0) {
    const noScoresMessage = document.createElement('p');
    noScoresMessage.textContent = 'No scores available yet.';
    noScoresMessage.classList.add('no-scores-message');
    leaderboardContentElement.appendChild(noScoresMessage);
  } else {
    scores.forEach(function(score, index) {
      const leaderboardItem = createLeaderboardItem(score, index);
      leaderboardContentElement.appendChild(leaderboardItem);
    });
  }
}


/*************************
 *     Music Visualizer  *
 *************************/

const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

function getFrequencyData() {
  if (!dataArray || !audioContext) return;
  analyser.getByteFrequencyData(dataArray);
}

function clearCanvas() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBars() {
  const barWidth = (canvas.width / bufferLength) * 4.5;
  let barHeight;
  let x = 0;

  for(let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 0.6;
    canvasContext.fillStyle = 'rgba(255, 255, 255, 0.3)';
    canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}

function draw() {
  getFrequencyData();
  clearCanvas();
  drawBars();
  requestAnimationFrame(draw);
}

draw();


