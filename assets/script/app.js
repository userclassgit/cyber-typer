import * as utils from './utils.js';
'use strict';

const backgroundVidElement = document.querySelector('.background-video');
const countdownElement = document.querySelector('.countdown');
const wordElement = document.querySelector('.word');
const hitsElement = document.querySelector('.hits');
const inputElement = document.querySelector('input');
const startButtonElement = document.querySelector('.start-button');


const words = ['dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money', 'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow', 'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer', 'philosophy', 'database', 'periodic', 'capitalism', 'abominable', 'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada', 'coffee', 'monstrosity', 'abomination', 'chocolate', 'eleven', 'technology', 'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake', 'baseball', 'beyond', 'evolution', 'banana', 'perfumer', 'computer', 'management', 'discovery', 'ambition', 'music', 'eagle', 'crown', 'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'superman', 'library', 'unboxing', 'bookstore', 'language', 'homework', 'fantastic', 'economy', 'interview', 'awesome', 'challenge', 'science', 'mystery', 'famous', 'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow', 'keyboard', 'window'];

// let wordsCopy = [...words];


// Shuffle function
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

startButtonElement.addEventListener('click', () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; // Reset the audio playback to the start
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
      startButtonElement.textContent = 'Restart'; // Change the button text to "Restart"
      inputElement.value = ''; // Clear the input field
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0; // Reset the audio playback to the start
    }
  }, 1000);

  hits = 0; // Reset the hit counter
  hitsElement.textContent = `Hits: ${hits}`; // Update the hit counter display

  inputElement.value = ''; // Clear the input field
  inputElement.focus(); // Set focus to the input field

  gameStarted = true;
  backgroundMusic.play().catch(error => console.error("Audio playback error: ", error));
});

let hits = 0;

inputElement.addEventListener('input', () => {
  if (gameStarted && inputElement.value === wordsCopy[0]) {
    wordsCopy.shift(); // Remove the word from wordsCopy
    wordElement.textContent = wordsCopy[0]; // Display the next word
    inputElement.value = ''; // Clear the input field
    hits++; // Increment the hit counter
    hitsElement.textContent = `Hits: ${hits}`; // Update the hit counter display
  }
});



/*******************************************
 *                                         *
 *              Audio Visualizer           *
 *                                         *
 *******************************************/


const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioSource = audioContext.createMediaElementSource(backgroundMusic);
const analyser = audioContext.createAnalyser();

audioSource.connect(analyser);
analyser.connect(audioContext.destination);

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');
function draw() {
  analyser.getByteFrequencyData(dataArray);
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 4.5; // Change bar width here
  let barHeight;
  let x = 0;

  for(let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 0.6; // Change bar height here
    canvasContext.fillStyle = 'rgba(255, 255, 255, 0.3)'; // Change bar color here

    // Change the shape of the bars here. Currently, it's a rectangle.
    canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    x += barWidth + 1; // Change space between bars here
  }

  requestAnimationFrame(draw);
}

draw();