import './style.css';
import {
  canMoveTo,
  findExitPosition,
  findShortestPath,
  type Position,
} from './game/mazeLogic';

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
let solutionPath: Position[] = [];

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
    <div class="button-row">
  <button id="reset-button">Reset Game</button>
  <button id="solve-button">Show Shortest Path</button>
</div>
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

const isPath = solutionPath.some(
  position => position.row === rowIndex && position.col === colIndex
);

if (isPath && cell !== 'E') {
  return `<div class="cell path">•</div>`;
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

const solveButton = document.querySelector<HTMLButtonElement>('#solve-button');

if (solveButton) {
  solveButton.addEventListener('click', showShortestPath);
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

  if (!canMoveTo(maze, nextRow, nextCol)) {
    return;
  }

  playerPosition = {
  row: nextRow,
  col: nextCol,
};

solutionPath = [];

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
  solutionPath = [];
  renderMaze();
}

function showShortestPath() {
  const exitPosition = findExitPosition(maze);

  solutionPath = findShortestPath(maze, playerPosition, exitPosition);

  renderMaze();
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