import './style.css';

const maze = [
  ['#', '#', '#', '#', '#', '#', '#'],
  ['#', 'P', ' ', ' ', ' ', 'E', '#'],
  ['#', ' ', '#', '#', ' ', ' ', '#'],
  ['#', ' ', ' ', '#', ' ', ' ', '#'],
  ['#', '#', '#', '#', '#', '#', '#'],
];

const appElement = document.querySelector<HTMLDivElement>('#app');

if (!appElement) {
  throw new Error('App element not found');
}

const app = appElement;
function renderMaze() {
  app.innerHTML = `
    <h1>Maze Escape AI</h1>
    <p>Use this first version to display a maze grid.</p>
    <div class="maze">
      ${maze
        .map(
          row => `
            <div class="row">
              ${row
                .map(cell => `<div class="cell ${getCellClass(cell)}">${getCellText(cell)}</div>`)
                .join('')}
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

function getCellClass(cell: string): string {
  if (cell === '#') return 'wall';
  if (cell === 'P') return 'player';
  if (cell === 'E') return 'exit';
  return 'empty';
}

function getCellText(cell: string): string {
  if (cell === 'P') return '🙂';
  if (cell === 'E') return '🚪';
  return '';
}

renderMaze();