export type Position = {
  row: number;
  col: number;
};

export function canMoveTo(maze: string[][], row: number, col: number): boolean {
  if (row < 0 || row >= maze.length) {
    return false;
  }

  if (col < 0 || col >= maze[row].length) {
    return false;
  }

  return maze[row][col] !== '#';
}

export function findExitPosition(maze: string[][]): Position {
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      if (maze[row][col] === 'E') {
        return { row, col };
      }
    }
  }

  throw new Error('Exit not found');
}

export function findShortestPath(
  maze: string[][],
  start: Position,
  end: Position
): Position[] {
  const queue: { row: number; col: number; path: Position[] }[] = [
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

      if (!canMoveTo(maze, nextRow, nextCol)) {
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

export function generateRandomMaze(
  rows: number,
  cols: number,
  extraWallChance = 0
): string[][] {
  if (rows < 5 || cols < 5) {
    throw new Error('Maze must be at least 5 rows by 5 columns');
  }

  const adjustedRows = rows % 2 === 0 ? rows + 1 : rows;
  const adjustedCols = cols % 2 === 0 ? cols + 1 : cols;

  const maze: string[][] = Array.from({ length: adjustedRows }, () =>
    Array.from({ length: adjustedCols }, () => '#')
  );

  const directions = [
    { row: -2, col: 0 },
    { row: 2, col: 0 },
    { row: 0, col: -2 },
    { row: 0, col: 2 },
  ];

  function shuffle<T>(items: T[]): T[] {
    const copy = [...items];

    for (let i = copy.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
    }

    return copy;
  }

  function carvePath(row: number, col: number) {
    maze[row][col] = ' ';

    for (const direction of shuffle(directions)) {
      const nextRow = row + direction.row;
      const nextCol = col + direction.col;

      const isInsideMaze =
        nextRow > 0 &&
        nextRow < adjustedRows - 1 &&
        nextCol > 0 &&
        nextCol < adjustedCols - 1;

      if (!isInsideMaze) {
        continue;
      }

      if (maze[nextRow][nextCol] === '#') {
        const wallRow = row + direction.row / 2;
        const wallCol = col + direction.col / 2;

        maze[wallRow][wallCol] = ' ';
        carvePath(nextRow, nextCol);
      }
    }
  }

  carvePath(1, 1);

  const exitPosition = findFarthestDeadEnd(maze, { row: 1, col: 1 });

  maze[1][1] = ' ';
  maze[exitPosition.row][exitPosition.col] = 'E';

  return maze;
}

function findFarthestDeadEnd(
  maze: string[][],
  start: Position
): Position {
  const queue: { position: Position; distance: number }[] = [
    { position: start, distance: 0 },
  ];

  const visited = new Set<string>();
  visited.add(`${start.row},${start.col}`);

  let bestExit = start;
  let bestScore = -1;

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

    const { position, distance } = current;

    const isStart =
      position.row === start.row && position.col === start.col;

    if (!isStart && isDeadEnd(maze, position)) {
      const nearbyDeadEnds = countNearbyDeadEnds(maze, position, 6);

      const score = distance + nearbyDeadEnds * 12;

      if (score > bestScore) {
        bestExit = position;
        bestScore = score;
      }
    }

    for (const direction of directions) {
      const next = {
        row: position.row + direction.row,
        col: position.col + direction.col,
      };

      const key = `${next.row},${next.col}`;

      if (visited.has(key)) {
        continue;
      }

      if (!canMoveTo(maze, next.row, next.col)) {
        continue;
      }

      visited.add(key);
      queue.push({ position: next, distance: distance + 1 });
    }
  }

  return bestExit;
}

function isDeadEnd(maze: string[][], position: Position): boolean {
  const directions = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  let openNeighborCount = 0;

  for (const direction of directions) {
    const neighborRow = position.row + direction.row;
    const neighborCol = position.col + direction.col;

    if (canMoveTo(maze, neighborRow, neighborCol)) {
      openNeighborCount++;
    }
  }

  return openNeighborCount === 1;
}

function countNearbyDeadEnds(
  maze: string[][],
  position: Position,
  radius: number
): number {
  let count = 0;

  for (let row = 1; row < maze.length - 1; row++) {
    for (let col = 1; col < maze[row].length - 1; col++) {
      const currentPosition = { row, col };

      if (
        currentPosition.row === position.row &&
        currentPosition.col === position.col
      ) {
        continue;
      }

      if (!isDeadEnd(maze, currentPosition)) {
        continue;
      }

      const distance =
        Math.abs(position.row - currentPosition.row) +
        Math.abs(position.col - currentPosition.col);

      if (distance <= radius) {
        count++;
      }
    }
  }

  return count;
}