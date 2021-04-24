/**
 * Basic 2d vector
 */
class Vector {
  /**
   * Coordinates of 2d point
   * @param {number} x 
   * @param {number} y 
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * @return - {@link Vector}
   */
  copy() {
    return new Vector(this.x, this.y);
  }

  /**
   * Add two Vectors
   * @param {Vector} other 
   * @return - {@link Vector}
   */
  add(other) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  /**
   * Equivalent to
   * ```js
   * v.add(other.mul(-1))
   * ```
   * @param {Vector} other 
   * @return - {@link Vector}
   */
  sub(other) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  /**
   * Multiply {@link Vector} by number
   * @param {number} lambda - multiplication coefficient
   */
  mul(lambda) {
    return new Vector(this.x * lambda, this.y * lambda);
  }
}
