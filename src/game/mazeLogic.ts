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

export function generateRandomMaze(rows: number, cols: number): string[][] {
  if (rows < 5 || cols < 5) {
    throw new Error('Maze must be at least 5 rows by 5 columns');
  }

  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const maze: string[][] = [];

    for (let row = 0; row < rows; row++) {
      const currentRow: string[] = [];

      for (let col = 0; col < cols; col++) {
        const isBorder =
          row === 0 || row === rows - 1 || col === 0 || col === cols - 1;

        if (isBorder) {
          currentRow.push('#');
        } else {
          const isWall = Math.random() < 0.25;
          currentRow.push(isWall ? '#' : ' ');
        }
      }

      maze.push(currentRow);
    }

    maze[1][1] = ' ';
    maze[rows - 2][cols - 2] = 'E';

    const path = findShortestPath(
      maze,
      { row: 1, col: 1 },
      { row: rows - 2, col: cols - 2 }
    );

    if (path.length > 0) {
      return maze;
    }

    attempts++;
  }

  throw new Error('Failed to generate a solvable maze');
}