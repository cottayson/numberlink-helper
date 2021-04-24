/**
 * Graphics object contains default settings
 * @const
 */
const graphics = {
  width: 500,
  height: 500,
  cellSize: 50,
  circleDiameter: 7,
  textSize: 20,
  lineSize: 2,
  colorTheme: {
    /** @type {p5.Color} */
    background: [0, 0, 0],
    lines: "gray",
    path: "blue",
    text: "white",
    borderPoint: {
      0: "#f22", // red
      1: "#2f2", // green
      2: "#aaa", // gray
      3: "#f2f" // logical error have purple color
    }
  }
};
