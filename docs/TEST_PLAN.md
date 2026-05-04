# Test Plan

## Scope

This test plan covers the core logic for Maze Escape AI, including maze movement, wall collision, exit detection, random maze generation, and BFS pathfinding.

## Automated Tests

The project uses Vitest for unit testing.

Tested areas:
- Movement into open cells
- Movement blocked by walls
- Movement blocked outside maze boundaries
- Exit detection
- BFS path starts at the player
- BFS path ends at the cheese
- BFS path does not pass through walls
- Randomly generated mazes are solvable

## Manual Test Cases

| Test Case | Steps | Expected Result |
|---|---|---|
| Move mouse | Press WASD or arrow keys | Mouse moves one tile |
| Hit wall | Move into a wall | Mouse does not move |
| Reach cheese | Move mouse onto cheese | Win message appears |
| Reset level | Click Reset Level | Mouse returns to start |
| New maze | Click New Maze | New maze appears at same level |
| Skip level | Click Skip Level | Game advances to next level |
| Show solution | Click Show Shortest Path | Shortest path is highlighted |

## Future Testing Ideas

- Add Playwright end-to-end tests
- Test keyboard input in browser
- Test level progression
- Test skip-level behavior