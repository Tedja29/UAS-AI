const mazeElement = document.getElementById('maze');
const size = 8;

let maze = [];
let playerX = 0;
let playerY = 0;
const goalX = size - 1;
const goalY = size - 1;
let hintPath = [];

function generateNewMaze() {
  maze = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => (Math.random() < 0.3 ? 1 : 0))
  );
  maze[0][0] = 0; // Start
  maze[goalY][goalX] = 0; // Goal
  playerX = 0;
  playerY = 0;
  hintPath = [];
  drawMaze();
}

function drawMaze() {
  mazeElement.innerHTML = '';
  mazeElement.style.gridTemplateColumns = `repeat(${size}, 30px)`;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (maze[y][x] === 1) cell.classList.add('wall');
      else if (x === playerX && y === playerY) cell.classList.add('player');
      else if (hintPath.some(([hx, hy]) => hx === x && hy === y)) cell.classList.add('hint');

      mazeElement.appendChild(cell);
    }
  }
}

function movePlayer(dx, dy) {
  const newX = playerX + dx;
  const newY = playerY + dy;
  if (
    newX >= 0 && newX < size &&
    newY >= 0 && newY < size &&
    maze[newY][newX] === 0
  ) {
    playerX = newX;
    playerY = newY;
    hintPath = [];
    drawMaze();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') movePlayer(0, -1);
  else if (e.key === 'ArrowDown') movePlayer(0, 1);
  else if (e.key === 'ArrowLeft') movePlayer(-1, 0);
  else if (e.key === 'ArrowRight') movePlayer(1, 0);
});

function showHint() {
  hintPath = bfs(playerX, playerY, goalX, goalY);
  drawMaze();
}

function bfs(startX, startY, endX, endY) {
  const queue = [[startX, startY]];
  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  const parent = Array.from({ length: size }, () => Array(size).fill(null));
  visited[startY][startX] = true;

  const directions = [
    [0, -1], [0, 1], [-1, 0], [1, 0]
  ];

  while (queue.length > 0) {
    const [x, y] = queue.shift();
    if (x === endX && y === endY) break;

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      if (
        newX >= 0 && newX < size &&
        newY >= 0 && newY < size &&
        maze[newY][newX] === 0 &&
        !visited[newY][newX]
      ) {
        visited[newY][newX] = true;
        parent[newY][newX] = [x, y];
        queue.push([newX, newY]);
      }
    }
  }

  function autoSolve() {
  hintPath = bfs(playerX, playerY, goalX, goalY);
  let index = 0;

  const interval = setInterval(() => {
    if (index >= hintPath.length) {
      clearInterval(interval);
      return;
    }
    const [x, y] = hintPath[index];
    playerX = x;
    playerY = y;
    drawMaze();
    index++;
  }, 300);
}


  const path = [];
  let curr = [endX, endY];
  while (curr && !(curr[0] === startX && curr[1] === startY)) {
    path.push(curr);
    curr = parent[curr[1]][curr[0]];
  }

  return path.reverse();
}

generateNewMaze();
