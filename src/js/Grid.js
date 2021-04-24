const Relax = {
  NO_CHANGES: 0,
  RELAXED: 1,
  ERROR: 2,
  0: "NO_CHANGES",
  1: "RELAXED",
  2: "ERROR",
};

const LineColor = { UNKNOWN: 0, EMPTY: -1 };

/**  Border cantains info about intersection of path and border of square */
class Border {
  /** @type {number} */
  static PADDING = 1;
  /** @type {BorderPoint} */
  static NOT_INTERSECT = 0
  /** @type {BorderPoint} */
  static INTERSECT = 1
  /** @type {BorderPoint} */
  static UNKNOWN = 2
  /** @type {BorderPoint} */
  static EMPTY_SET = 3
  /**
   * @param {Grid} parent 
   * @param {number} row 
   * @param {number} column 
   * @param {BorderPoint} borderType
   */
  constructor(parent, row, column, borderType) {
    this.parent = parent;
    this.row = row;
    this.column = column;
    this.borderType = borderType;
  }

  toPosition() {
    let cs = graphics.cellSize;
    let x = this.column * cs / 2;
    let y = this.row * cs / 2;
    return { x, y };
  }

  copy() {
    return new Border(this.parent, this.row, this.column, this.borderType);
  }

  show() {
    push();
    let cs = graphics.cellSize;
    let color = graphics.colorTheme.borderPoint[this.borderType];
    fill(color);
    noStroke();
    circle(cs / 2 * this.column, cs / 2 * this.row, graphics.circleDiameter);
    pop();
  }
};
/**
 * Cell has position represented by {@link Cell#row} and {@link Cell#column}, has {@link Cell#lineColor}
 * @summary A concise summary.
 */
class Cell {
  /**
   * @param {Grid} parent parent object for cell object
   * @param {number} row index of row
   * @param {number} column index of column
   * @param {LineColor} lineColor number that represents color of line
   */
  constructor(parent, row, column, lineColor) {
    this.parent = parent;
    this.row = row;
    this.column = column;
    this.lineColor = lineColor;
  }

  copy() {
    return new Cell(this.parent, this.row, this.column, this.lineColor);
  }

  /** Get near borders */
  getBorders() {
    const borders = this.parent.borders;
    const withOfBorders = (this.parent.size.x + 1);
    const up = this.column + (this.row * 2) * withOfBorders;
    const down = this.column + (this.row * 2 + 2) * withOfBorders;
    const left = this.column + (this.row * 2 + 1) * withOfBorders;
    const right = (this.column + 1) + (this.row * 2 + 1) * withOfBorders;
    return {
      up: borders[up],
      down: borders[down],
      left: borders[left],
      right: borders[right],
    }
  }

  getBorderList() {
    let borders = this.getBorders();
    return [borders.up, borders.down, borders.left, borders.right];
  }
  
  /** Draw single cell on canvas
   * @example
   * let c = new Cell(0, 0, LineColor.UNKNOWN);
   * c.show();
   */
  show() {
    push();
    const cs = graphics.cellSize;
    fill(graphics.colorTheme.background);
    stroke(graphics.colorTheme.lines);
    rect(this.column * cs, this.row * cs, cs, cs);
    // Draw lines
    let borders = this.getBorderList();
    let greens = borders.filter(b => b.borderType === Border.INTERSECT);
    if (greens.length === 2) {
      stroke(graphics.colorTheme.path);
      let p1 = greens[0].toPosition();
      let p2 = greens[1].toPosition();
      line(p1.x, p1.y, p2.x, p2.y);
    }
    // Draw text
    noStroke();
    if (this.lineColor !== -1) {
      fill(graphics.colorTheme.text);
      textAlign(CENTER, CENTER);
      let msg = this.lineColor.toString();
      if (this.lineColor === 0) {
        msg = "*";
      }
      text(msg, this.column * cs + cs / 2, this.row * cs + cs / 2);
    }
    pop();
  }
}

/**
 * Grid class, grid contains [cells]{@link Grid#cells}
 * 
 * Resize grid function
 * @see {@link Grid~resize}
 * @todo Write the documentation.
 */
class Grid {
  /** @type {undefined | object} */
  lastError = undefined;
  /**
   * @param {number} width width of the {@link Grid}
   * @param {number} height height of the {@link Grid}
   */
  constructor(width, height, pos = new Vector(100, 100)) {
    this.pos = pos;
    /** @type {Vector} */ this.size = new Vector(width, height);
    /** @type {Cell[]} */ this.cells = [];
    for (let i = 0; i < width * height; i++) {
      const cell = new Cell(this, ~~(i / width), i % width, LineColor.UNKNOWN);
      this.cells.push(cell);
    }
    const widthOfBorderGrid = width + 1;
    const heightOfBorderGrid = height * 2 + 1;
    /** @type {Border[]} */
    this.borders = [];
    for (let i = 0; i < widthOfBorderGrid * heightOfBorderGrid; i++) {
      const row = ~~(i / widthOfBorderGrid);
      const column = 2 * (i % widthOfBorderGrid) + (row % 2 === 0 ? 1 : 0);
      const border = new Border(this, row, column, Border.UNKNOWN);
      this.borders.push(border);
    }
    this.resetBorders();
  }

  /** Reset assumptions about border intersections */
  resetBorders() {
    for (let border of this.borders) {
      if (border.column === 0 || border.column === this.size.x * 2 || 
          border.row    === 0 || border.row    === this.size.y * 2) {
        border.borderType = Border.NOT_INTERSECT;
      } else {
        border.borderType = Border.UNKNOWN;
      }
    }
  }

  /** @type {(row: number, column: number) => Cell} */
  getCell(row, column) {
    let ind = column + row * this.size.x;
    return this.cells[ind];
  }

  getRhombus(halfRow, column) {
    const withOfBorders = this.size.x + 1;
    let up = column + (halfRow % 2) + halfRow * withOfBorders;
    let down = column + (halfRow % 2) + (halfRow + 2) * withOfBorders;
    let left = column + (halfRow + 1) * withOfBorders;
    let right = column + 1 + (halfRow + 1) * withOfBorders;
    return {
      up: this.borders[up],
      down: this.borders[down],
      left: this.borders[left],
      right: this.borders[right],
    }
  }

  /**
   * Iteratively apply `T1: forall cells in grid, isEmpty(cell) -> sum(cell.getBorders()) = 2`
   * because in each cell must be one incoming and one outcoming part of path
   * `T2: forall cells in grid, isDigit(cell) -> sum(cell.getBorders()) = 1`
   * `T3: forall cells in grid, isWall(cell) -> sum(cell.getBorders()) = 0`
   * @todo Before making relax we can save borders list to make undo when `Relax.ERROR` happens
   */
  relax() {
    /* 
      Assume we don't have walls on the grid => we have only empty and cells with digit
    */
    let tempBorders = this.borders.map(b => b.copy());
    let borderTypeChanged = false;
    for (let halfrow = 0; halfrow < 2 * this.size.y - 1; halfrow++) {
      for (let column = 0; column < this.size.x; column++) {
        if (halfrow % 2 === 1 && column >= this.size.x - 1) {
          continue; // ignore near right boundary points
        }
        let cellFlag = halfrow % 2 === 0;
        let digit = undefined;
        if (cellFlag) {
          digit = this.getCell(halfrow >> 1, column).lineColor;
        }
        let rhombus = this.getRhombus(halfrow, column);
        let borderList = [rhombus.down, rhombus.up, rhombus.left, rhombus.right];
        let unknowns = borderList.filter(b => b.borderType === Border.UNKNOWN);
        let reds = borderList.filter(b => b.borderType === Border.NOT_INTERSECT);
        let greens = borderList.filter(b => b.borderType === Border.INTERSECT);
        // console.log({ halfrow, column, greens: greens.length, reds: reds.length });
        if (greens.length > 2 || reds.length === 4 || reds.length === 3 && digit === LineColor.EMPTY) {
          this.lastError = { halfrow, column, greens: greens.length, reds: reds.length };
          // this.borders = tempBorders; // make undo when `Relax.ERROR` happens
          return Relax.ERROR;
        }

        if (greens.length === 1 && digit !== undefined && digit > 0) { // color is not empty and unknown
          for (let b of unknowns) {
            b.borderType = Border.NOT_INTERSECT;
            borderTypeChanged = true;
          }
        }
        // let { min, max } = getSumOfBorderTypes(borderList);
        if (unknowns.length <= 2) {

          if (greens.length === 2) { // if two green points near cell
            for (let b of unknowns) {
              b.borderType = Border.NOT_INTERSECT; // set two reds
              borderTypeChanged = true;
            }
          } else if (reds.length === 3) {
            for (let b of unknowns) {
              b.borderType = Border.INTERSECT;
              borderTypeChanged = true;
            }
          } else if (reds.length === 2 && digit === LineColor.EMPTY) {
            for (let b of unknowns) {
              b.borderType = Border.INTERSECT;
              borderTypeChanged = true;
            }
          }

        }
      }
    }
    if (borderTypeChanged) {
      return Relax.RELAXED;
    } else {
      return Relax.NO_CHANGES;
    }
  }

  /** Draw grid on canvas */
  show() {
    push();
    background([100, 100, 100]);
    translate(this.pos.x, this.pos.y);
    for (let cell of this.cells) {
      cell.show();
    }
    for (let border of this.borders) {
      border.show();
    }
    pop();
  }

  /**
   * Method for resizing [Grid]{@link Grid}
   * @theorem theorem T1
   * @param {number} width
   * @param {number} height
   * @todo How to add new field with `@` symbol to JSDoc?
   */
  resize(width, height) {

  }
}

/**
 * @param {Border[]} borders list of borders
 * @returns {{min: number, max: number}} range of sum of border types
 */
function getSumOfBorderTypes(borders) {
  let [min, max] = [0, 0];
  for (let border of borders) {
    let t = border.borderType;
    if (t === Border.INTERSECT || t === Border.NOT_INTERSECT) {
      min += t;
      max += t;
    } else if (t === Border.UNKNOWN) {
      max += 1;
    } else { // t === Border.ERROR
      [min, max] = [Infinity, 0]; // empty range
    }
  }
  return { min, max };
}