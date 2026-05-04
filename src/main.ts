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
let solutionPath: { row: number; col: number }[] = [];

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

  if (!canMoveTo(nextRow, nextCol)) {
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

function canMoveTo(row: number, col: number): boolean {
  if (row < 0 || row >= maze.length) {
    return false;
  }

  if (col < 0 || col >= maze[row].length) {
    return false;
  }

  return maze[row][col] !== '#';
}

function findShortestPath(
  start: { row: number; col: number },
  end: { row: number; col: number }
): { row: number; col: number }[] {
  const queue: { row: number; col: number; path: { row: number; col: number }[] }[] = [
    {
      row: start.row,
      col: start.col,
      path: [start],
    },
  ];

  const visited = new Set<string>();
  visited.add(`${start.row},${start.col}`);

  const directions = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) {
      break;
    }

    if (current.row === end.row && current.col === end.col) {
      return current.path;
    }

    for (const direction of directions) {
      const nextRow = current.row + direction.row;
      const nextCol = current.col + direction.col;
      const key = `${nextRow},${nextCol}`;

      if (visited.has(key)) {
        continue;
      }

      if (!canMoveTo(nextRow, nextCol)) {
        continue;
      }

      visited.add(key);

      queue.push({
        row: nextRow,
        col: nextCol,
        path: [...current.path, { row: nextRow, col: nextCol }],
      });
    }
  }

  return [];
}

function showShortestPath() {
  const exitPosition = findExitPosition();

  solutionPath = findShortestPath(playerPosition, exitPosition);

  renderMaze();
}

function findExitPosition(): { row: number; col: number } {
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      if (maze[row][col] === 'E') {
        return { row, col };
      }
    }
  }

  throw new Error('Exit not found');
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