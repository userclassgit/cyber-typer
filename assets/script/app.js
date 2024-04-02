import * as utils from './utils.js';
'use strict';

const backgroundVidElement = document.querySelector('.background-video');
const countdownElement = document.querySelector('.countdown');
const wordElement = document.querySelector('.word');
const hitsElement = document.querySelector('.hits');
const inputElement = document.querySelector('input');
const startButtonElement = document.querySelector('.start-button');


const words = ['dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money', 'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow', 'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer', 'philosophy', 'database', 'periodic', 'capitalism', 'abominable', 'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada', 'coffee', 'monstrosity', 'abomination', 'chocolate', 'eleven', 'technology', 'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake', 'baseball', 'beyond', 'evolution', 'banana', 'perfumer', 'computer', 'management', 'discovery', 'ambition', 'music', 'eagle', 'crown', 'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'superman', 'library', 'unboxing', 'bookstore', 'language', 'homework', 'fantastic', 'economy', 'interview', 'awesome', 'challenge', 'science', 'mystery', 'famous', 'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow', 'keyboard', 'window'];



function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let wordsCopy = [...words];
shuffle(wordsCopy);

wordElement.textContent = wordsCopy[0];

let countdownInterval = null;

let gameStarted = false;

const backgroundMusic = new Audio('/assets/media/music.mp3');

let audioContext;
let audioSource;
let analyser;
let bufferLength;
let dataArray;


startButtonElement.addEventListener('click', async () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioSource = audioContext.createMediaElementSource(backgroundMusic);
    analyser = audioContext.createAnalyser();

    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    draw();

    // Resume the AudioContext
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
  }

  console.log('audioContext state:', audioContext.state);


  if (countdownInterval) {
    clearInterval(countdownInterval);
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }

  let countdown = 15;
  countdownElement.textContent = countdown;

  countdownInterval = setInterval(() => {
    countdown--;
    countdownElement.textContent = countdown;

    if (countdown === 0) {
      countdownElement.textContent = '15';
      clearInterval(countdownInterval);
      gameStarted = false;
      startButtonElement.textContent = 'Restart';
      inputElement.value = '';
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
  }, 1000);

  hits = 0;
  hitsElement.textContent = `Hits: ${hits}`;

  inputElement.value = '';
  inputElement.focus();

  gameStarted = true;
  backgroundMusic.play().catch(error => console.error("Audio playback error: ", error));
});

let hits = 0;

inputElement.addEventListener('input', () => {
  if (gameStarted && inputElement.value === wordsCopy[0]) {
    wordsCopy.shift();
    wordElement.textContent = wordsCopy[0];
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
function draw() {
  if (!dataArray) return;
  console.log('draw called');
  console.log(dataArray);
  if (!audioContext) return;
  analyser.getByteFrequencyData(dataArray);
  console.log('dataArray:', dataArray);

  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 4.5; // Change bar width here
  let barHeight;
  let x = 0;

  for(let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 0.6; // Change bar height here
    console.log('barHeight:', barHeight);

    canvasContext.fillStyle = 'rgba(255, 255, 255, 0.3)'; // Change bar color here
    
    canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    console.log('Bar drawn at:', x, canvas.height - barHeight, barWidth, barHeight);

    x += barWidth + 1; // Change space between bars here
  }

  requestAnimationFrame(draw);
  
}

draw();


