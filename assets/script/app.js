import * as utils from './utils.js';
'use strict';

const backgroundVidElement = document.querySelector('.background-video');
const countdownElement = document.querySelector('.countdown');
const wordElement = document.querySelector('.word');
const hitsElement = document.querySelector('.hits');
const inputElement = document.querySelector('input');
const startButtonElement = document.querySelector('.start-button');


const words = ['dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money', 'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow', 'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer', 'philosophy', 'database', 'periodic', 'capitalism', 'abominable', 'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada', 'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology', 'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake', 'baseball', 'beyond', 'evolution', 'banana', 'perfumer', 'computer', 'management', 'discovery', 'ambition', 'music', 'eagle', 'crown', 'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'superman', 'library', 'unboxing', 'bookstore', 'language', 'homework', 'fantastic', 'economy', 'interview', 'awesome', 'challenge', 'science', 'mystery', 'famous', 'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow', 'keyboard', 'window'];

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

startButtonElement.addEventListener('click', () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  let countdown = 15;
  countdownElement.textContent = countdown;

  countdownInterval = setInterval(() => {
    countdown--;
    countdownElement.textContent = countdown;

    if (countdown === 0) {
      countdownElement.textContent = '15';
      clearInterval(countdownInterval);
    }
  }, 1000);
});

inputElement.addEventListener('input', () => {
  if (inputElement.value === wordsCopy[0]) {
    wordsCopy.shift(); // Remove the word from wordsCopy
    wordElement.textContent = wordsCopy[0]; // Display the next word
    inputElement.value = ''; // Clear the input field
  }
});