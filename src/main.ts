import './style.css';

const maze = [
  ['#', '#', '#', '#', '#', '#', '#'],
  ['#', ' ', ' ', ' ', ' ', 'E', '#'],
  ['#', ' ', '#', '#', ' ', ' ', '#'],
  ['#', ' ', ' ', '#', ' ', ' ', '#'],
  ['#', '#', '#', '#', '#', '#', '#'],
];

let playerPosition = {
  row: 1,
  col: 1,
};

let gameWon = false;

const appElement = document.querySelector<HTMLDivElement>('#app');

if (!appElement) {
  throw new Error('App element not found');
}

const app = appElement;

function renderMaze() {
  app.innerHTML = `
    <h1>Maze Escape AI</h1>
    <p>Use WASD or arrow keys to move. Reach the door to escape.</p>
    ${gameWon ? '<h2 class="win-message">You escaped the maze!</h2>' : ''}
    <button id="reset-button">Reset Game</button>
    <div class="maze">
      ${maze
        .map(
          (row, rowIndex) => `
            <div class="row">
              ${row
                .map((cell, colIndex) => {
                  const isPlayer =
                    playerPosition.row === rowIndex &&
                    playerPosition.col === colIndex;

                  if (isPlayer) {
                    return `<div class="cell player">🙂</div>`;
                  }

                  return `<div class="cell ${getCellClass(cell)}">${getCellText(cell)}</div>`;
                })
                .join('')}
            </div>
          `
        )
        .join('')}
    </div>
  `;
  const resetButton = document.querySelector<HTMLButtonElement>('#reset-button');

if (resetButton) {
  resetButton.addEventListener('click', resetGame);
}
}

function getCellClass(cell: string): string {
  if (cell === '#') return 'wall';
  if (cell === 'E') return 'exit';
  return 'empty';
}

function getCellText(cell: string): string {
  if (cell === 'E') return '🚪';
  return '';
}

function movePlayer(rowChange: number, colChange: number) {
  if (gameWon) {
    return;
  }

  const nextRow = playerPosition.row + rowChange;
  const nextCol = playerPosition.col + colChange;

  if (!canMoveTo(nextRow, nextCol)) {
    return;
  }

  playerPosition = {
    row: nextRow,
    col: nextCol,
  };

  if (maze[nextRow][nextCol] === 'E') {
    gameWon = true;
  }

  renderMaze();
}
function resetGame() {
  playerPosition = {
    row: 1,
    col: 1,
  };

  gameWon = false;
  renderMaze();
}

function canMoveTo(row: number, col: number): boolean {
  if (row < 0 || row >= maze.length) {
    return false;
  }

  if (col < 0 || col >= maze[row].length) {
    return false;
  }

  return maze[row][col] !== '#';
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') {
    movePlayer(-1, 0);
  }

  if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') {
    movePlayer(1, 0);
  }

  if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
    movePlayer(0, -1);
  }

  if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
    movePlayer(0, 1);
  }
});

renderMaze();