import { initGame, setGameState, gameLoop } from './game.js';

const restartBtn = document.getElementById('restart-btn');
const messageContainer = document.getElementById('message-container');
const gameMessage = document.getElementById('game-message');
const container = document.getElementById('game-container');

let isStarted = false;


restartBtn.addEventListener('click', () => {
  messageContainer.style.display = 'none';
  initGame(container);
  isStarted = false;
});

// Inicijuojam žaidimą (canvas ir pradiniai objektai)
initGame(container);

export function showMessage(text) {
  gameMessage.textContent = text;
  messageContainer.style.display = 'block';
}