import { listen, select } from './utils.js';
'use strict';

const countdownElement = select('.countdown');
const wordElement = select('.word');
const hitsElement = select('.hits');
const inputElement = select('input');
const startButtonElement = select('.start-button');

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

const INITIAL_COUNTDOWN = 99;

window.onload = function() {
  const countdownElement = document.querySelector('.countdown');
  countdownElement.textContent = INITIAL_COUNTDOWN;
};

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

const backgroundMusic = new Audio('/assets/media/music.mp3');

let audioContext;
let audioSource;
let analyser;
let bufferLength;
let dataArray;


function resetGame() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }
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
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
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
}

listen('click', startButtonElement, async () => {
  resetGame();
  startCountdown();
  resetHits();
  startGame();
});

let hits = 0;

listen('input', inputElement, () => {
  if (gameStarted && inputElement.value.toUpperCase() === wordsCopy[0].toUpperCase()) {
    wordsCopy.shift();
    wordElement.textContent = wordsCopy[0].toUpperCase();
    inputElement.value = '';
    hits++;
    hitsElement.textContent = `Hits: ${hits}`;
  }
});


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


