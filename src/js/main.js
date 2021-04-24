/// <reference path="Grid.js" />
/// <reference path="User.js" />
/// <reference path="defs.js" />
/// <reference path="Vector.js" />
/// <reference path="Engine.js" />

/** @type {Grid} */
let grid;

function setup() {
  createCanvas(graphics.width, graphics.height);
  noLoop();
  textSize(graphics.textSize);
  strokeWeight(graphics.lineSize);
  grid = new Grid(5, 5);
}

function draw() {
  for (let cell of grid.cells) {
    if (cell.row < 2 && cell.column < 3)
      cell.lineColor = LineColor.EMPTY;
  }
  grid.getCell(4, 2).lineColor = 1;
  grid.getCell(1, 2).lineColor = 1;
  grid.relax() // Starting relax enabled
  grid.show();
}


function keyPressed() {
  if (key === 'r') {
    let msg = grid.relax();
    console.log(Relax[msg]);
    if (msg === Relax.ERROR) {
      console.log(grid.lastError);
    }
  }
  grid.show();
}

/** @type {(mx: number, my: number) => void} */
function cellClick(mx, my) {
  let cs = graphics.cellSize;
  let x = ~~(mx / cs);
  let y = ~~(my / cs);
  if (y >= grid.size.y || x >= grid.size.x || x < 0 || y < 0) {
    return;
  }
  let cell = grid.getCell(y, x);
  cell.lineColor = userChangeCellColor(cell.lineColor);
}

function userChangeCellColor(c) {
  const func = {
    "-1":  1,
       0: -1,
       1:  0,
  };
  return func[c];
}

/** @type {(t: BorderPoint) => BorderPoint} */
function userChangeBorderType(t) {
  /** @type {BorderPoint[]} */
  const func = [2, 0, 1, 3];
  return func[t];
}

/** @type {(mx: number, my: number) => void} */
function borderClick(mx, my) {
  // set of clicking is a rhombus(square rotated by 45 degree)
  let cs = graphics.cellSize;
  let x = ~~(mx / cs);
  let y = ~~(my / cs);
  // (x, y) coords of cell
  // the we use remainder to find 4 boundary triangles
  let rx = (mx % cs) / cs;
  let ry = (my % cs) / cs;
  let side = fourTriangles(rx, ry);
  if (y >= grid.size.y || x >= grid.size.x || x < 0 || y < 0) {
    return;
  }
  let cell = grid.getCell(y, x);
  let borders = cell.getBorders();
  borders[side].borderType = userChangeBorderType(borders[side].borderType);
}

/**
 * Calculate predicate for mouse pointer
 * @param {number} rx remainder of x coord
 * @param {number} ry remainder of y coord
 */
function fourTriangles(rx, ry) {
  if (rx > ry) {
    if (ry > 1 - rx) {
      return "right";
    } else {
      return "up";
    }
  } else {
    if (ry > 1 - rx) {
      return "down";
    } else {
      return "left";
    }
  }
}

function mousePressed() {
  let mx = mouseX - grid.pos.x;
  let my = mouseY - grid.pos.y;
  console.log();
  if (mouseButton === "left") {
    borderClick(mx, my);
  } else if (mouseButton === "right") {
    cellClick(mx, my);
  }
  grid.show();
}

window.oncontextmenu = () => {
  return false;
}
