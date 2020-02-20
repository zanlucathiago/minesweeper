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

  iterateAround = (i, j, callback) => {
    let res = 0;
    for (
      let row = Math.max(0, i - 1);
      row <= Math.min(this.getRows() - 1, i + 1);
      row += 1
    ) {
      for (
        let column = Math.max(0, j - 1);
        column <= Math.min(this.getColumns() - 1, j + 1);
        column += 1
      ) {
        if (row !== i || column !== j) {
          res += callback(row, column);
        }
      }
    }
    return res;
  };
}

export default new BoardHelper();
