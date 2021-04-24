interface ObjectConstructor {
  assign<T, U>(target: T, source: U): T & U;
  assign(target: any, ...sources: any[]): any;
}

namespace p5 {
  type Color = number[] | string;
}

declare const windowWidth: number;
declare const windowHeight: number;
declare let mouseX: number;
declare let mouseY: number;
declare let keyCode: number;
declare let key: string;

/**
 * Push context parameters into stack
 */
function push(): void;

/**
 * Pop context parameters from stack
 */
function pop(): void;

/**
 * Set stroke color
 */
function stroke(color: p5.Color): void;


/**
 * Set fill color
 */
function fill(color: p5.Color): void;

/**
 * Draw rect on canvas
 */
function rect(x: number, y: number, w: number, h: number): void;

/** Create canvas */
function createCanvas(width: number, height: number): void;

/**
 * Set background color
 * @param color background color
 */
function background(color: p5.Color):void;

/**
 * Disable drawing loop
 */
function noLoop(): void;

/**
 * Move canvas coordinate system by vector `(dx, dy)`
 */
function translate(dx: number, dy: number): void;

/**
 * Draw circle with center (x, y) and diameter d
 */
function circle(x: number, y: number, d: number): void;

/**
 * Disable stroke drawing
 */
function noStroke(): void

/** Set global text size */
function textSize(size: number): void;

/** Draw line from `(x1, y1)` to `(x2, y2)` */
function line(x1: number, y1: number, x2: number, y2: number): void;

/** Set size of stroke lines */
function strokeWeight(sizeOfLine: number): void;

declare let mouseButton: "left" | "right" | "center";

type VerticalAlign = number;
type HorizontalAlign = number;

declare const LEFT: HorizontalAlign;
declare const RIGHT: HorizontalAlign;
declare const CENTER: HorizontalAlign;

declare const BASELINE: VerticalAlign;
declare const BOTTOM: VerticalAlign;
declare const TOP: VerticalAlign;
declare const CENTER: VerticalAlign;

/**
 * Set text align
 * @param horizontal horizontal align of text
 * @param vertical vertical align of text
 */
function textAlign(horizontal: HorizontalAlign, vertical: VerticalAlign): number;

/** Draw text on canvas */
function text(msg: string, x: number, y: number): void;

/**
 * Color can be positive whole number
 */
type LineColor = number;

/**
 * + 0 - line don't intersect that border
 * + 1 - intersection exists
 * + 2 - unknown 
 *   * we don't know, exists intersection or not
 */
type BorderPoint = 0 | 1 | 2 | 3;


