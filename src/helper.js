class BoardHelper {
  getRows() {
    return this.rows;
  }

  setRows(rows) {
    this.rows = rows;
  }

  getColumns() {
    return this.columns;
  }

  setColumns(columns) {
    this.columns = columns;
  }

  getBombs() {
    return this.bombs;
  }

  setBombs(bombs) {
    this.bombs = bombs;
  }

  getIterations() {
    return this.iterations;
  }

  setIterations(iterations) {
    this.iterations = iterations;
  }

  getTotalGuesses() {
    return this.totalGuesses;
  }

  setTotalGuesses(totalGuesses) {
    this.totalGuesses = totalGuesses;
  }

  incrementTotalGuesses(totalGuesses = 1) {
    this.totalGuesses += totalGuesses;
  }

  getTotalWild() {
    return this.totalWild;
  }

  setTotalWild(totalWild) {
    this.totalWild = totalWild;
  }

  incrementTotalWild(totalWild = 1) {
    this.totalWild += totalWild;
  }

  min = {
    guessBomb: null,
  };

  getMin() {
    return this.min;
  }

  setMin(min) {
    this.min = min;
  }

  getSquaresOpened() {
    return this.squaresOpened;
  }

  setSquaresOpened(squaresOpened) {
    this.squaresOpened = squaresOpened;
  }

  incrementSquaresOpened(squaresOpened = 1) {
    this.squaresOpened += squaresOpened;
  }

  setGrid(grid) {
    this.grid = grid;
  }

  getGridCell(row, column) {
    return this.grid[row][column];
  }

  getGrid() {
    return this.grid;
  }

  getGridProperty(row, column, property) {
    return this.grid[row][column][property];
  }

  setGridProperty(row, column, property, value) {
    this.grid[row][column][property] = value;
  }

  incrementGridProperty(row, column, property, value = 1) {
    this.grid[row][column][property] += value;
  }
}

export default new BoardHelper();
