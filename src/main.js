import { initGame, setGameState } from './game.js';

const gameContainer = document.getElementById('game-container');
const messageContainer = document.getElementById('message-container');
const gameMessage = document.getElementById('game-message');
const restartBtn = document.getElementById('restart-btn');
const levelSelect = document.getElementById('levelSelect');
const startGameBtn = document.getElementById('startGameBtn');

function showMessage(msg) {
  gameMessage.textContent = msg;
  messageContainer.style.display = 'block';
  gameContainer.style.display = 'none';
}

function hideMessage() {
  messageContainer.style.display = 'none';
  gameContainer.style.display = 'block';
}

restartBtn.addEventListener('click', () => {
  hideMessage();
  const selectedLevel = parseInt(levelSelect.value);
  initGame(gameContainer, selectedLevel);
});

startGameBtn.addEventListener('click', () => {
  hideMessage();
  const selectedLevel = parseInt(levelSelect.value);
  initGame(gameContainer, selectedLevel);
});

window.showMessage = showMessage; // kad game.js galėtų iškviesti showMessage

// Pradinis žaidimo startas
initGame(gameContainer, parseInt(levelSelect.value));