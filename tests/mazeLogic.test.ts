import { describe, expect, it } from 'vitest';
import { canMoveTo, findExitPosition, findShortestPath } from '../src/game/mazeLogic';

const testMaze = [
  ['#', '#', '#', '#', '#'],
  ['#', ' ', ' ', 'E', '#'],
  ['#', ' ', '#', '#', '#'],
  ['#', ' ', ' ', ' ', '#'],
  ['#', '#', '#', '#', '#'],
];

describe('canMoveTo', () => {
  it('allows movement into an empty cell', () => {
    expect(canMoveTo(testMaze, 1, 1)).toBe(true);
  });

  it('blocks movement into a wall', () => {
    expect(canMoveTo(testMaze, 0, 0)).toBe(false);
  });

  it('blocks movement outside the maze', () => {
    expect(canMoveTo(testMaze, -1, 0)).toBe(false);
    expect(canMoveTo(testMaze, 100, 0)).toBe(false);
    expect(canMoveTo(testMaze, 1, -1)).toBe(false);
    expect(canMoveTo(testMaze, 1, 100)).toBe(false);
  });

  it('allows movement onto the exit cell', () => {
    expect(canMoveTo(testMaze, 1, 3)).toBe(true);
  });
});

describe('findExitPosition', () => {
  it('finds the exit in the maze', () => {
    expect(findExitPosition(testMaze)).toEqual({ row: 1, col: 3 });
  });

  it('throws an error when no exit exists', () => {
    const mazeWithoutExit = [
      ['#', '#', '#'],
      ['#', ' ', '#'],
      ['#', '#', '#'],
    ];

    expect(() => findExitPosition(mazeWithoutExit)).toThrow('Exit not found');
  });
});

describe('findShortestPath', () => {
  it('finds a path from start to exit', () => {
    const path = findShortestPath(testMaze, { row: 1, col: 1 }, { row: 1, col: 3 });

    expect(path.length).toBeGreaterThan(0);
  });

  it('starts at the start position', () => {
    const path = findShortestPath(testMaze, { row: 1, col: 1 }, { row: 1, col: 3 });

    expect(path[0]).toEqual({ row: 1, col: 1 });
  });

  it('ends at the exit position', () => {
    const path = findShortestPath(testMaze, { row: 1, col: 1 }, { row: 1, col: 3 });

    expect(path[path.length - 1]).toEqual({ row: 1, col: 3 });
  });

  it('does not move through walls', () => {
    const path = findShortestPath(testMaze, { row: 1, col: 1 }, { row: 1, col: 3 });

    for (const position of path) {
      expect(testMaze[position.row][position.col]).not.toBe('#');
    }
  });
});