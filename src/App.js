import { FaBomb } from 'react-icons/fa';
import { IoIosFlag } from 'react-icons/io';
import React from 'react';
import './App.css';
import Board from './Board.json';
import {
  Container,
  Grid,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import LocalStorage from './LocalStorage';

const colors = ['#000', '#3b71ff', '#417c03', '#ed4f1d', '#193680'];

export default class App extends React.Component {
  bombs = 5;
  rows = 7;
  columns = 7;
  squaresOpened = 0;

  constructor(props) {
    super(props);
    const size = LocalStorage.getLevel();
    this.updateDimensions(size);
    this.state = {
      grid: this.generateGrid(),
      size,
    };
  }

  componentDidUpdate() {
    if (this.status) {
      alert(this.status);
      this.status = null;
      this.squaresOpened = 0;
      this.setState({ grid: this.generateGrid() });
    }
  }

  generateGrid = () => {
    const grid = Array(this.rows)
      .fill()
      .map(() =>
        Array(this.columns)
          .fill()
          .map(() => ({
            bomb: false,
            flag: false,
            number: 0,
            open: false,
            isWild: true,
          })),
      );
    Array(this.bombs)
      .fill()
      .forEach(() => {
        let i;
        let j;
        do {
          const index = Math.floor(Math.random() * this.rows * this.columns);
          i = Math.floor(index / this.columns);
          j = index % this.columns;
        } while (grid[i][j].bomb);
        this.iterateAround(i, j, (row, column) => {
          grid[row][column].number += 1;
        });
        grid[i][j].bomb = true;
      });
    return grid;
  };

  iterateAround = (i, j, callback) => {
    let res = 0;
    for (
      let row = Math.max(0, i - 1);
      row <= Math.min(this.rows - 1, i + 1);
      row++
    ) {
      for (
        let column = Math.max(0, j - 1);
        column <= Math.min(this.columns - 1, j + 1);
        column++
      ) {
        if (row !== i || column !== j) {
          res += callback(row, column);
        }
      }
    }
    return res;
  };

  recursiveOpener = (row, column) => {
    const { grid } = this.state;
    const currCell = grid[row][column];
    if (!currCell.open && !currCell.flag) {
      if (currCell.bomb) {
        this.status = 'Você perdeu. Clique para recomeçar.';
      }

      currCell.open = true;
      this.squaresOpened++;
      if (this.squaresOpened === this.rows * this.columns - this.bombs) {
        this.status = 'Você venceu! Clique para recomeçar.';
      }
      currCell.isWild = false;
      if (!currCell.number) {
        this.iterateAround(row, column, (curRow, curColumn) => {
          this.recursiveOpener(curRow, curColumn);
        });
      } else {
        this.iterateAround(row, column, (curRow, curColumn) => {
          grid[curRow][curColumn].isWild = false;
        });
      }
    }
  };

  updateDimensions = (size) => {
    const { bombs, dimensions } = Board[size];
    const [rows, columns] = dimensions;
    this.rows = rows;
    this.columns = columns;
    this.bombs = bombs;
  };

  setChanges = (e) => {
    const size = e.target.value;
    this.updateDimensions(size);
    LocalStorage.setLevel(size);
    this.setState({ grid: this.generateGrid(), size });
  };

  calculate = () => {
    this.iterations = 0;
    const { grid } = this.state;
    this.totalGuesses = 0;
    this.totalWild = 0;
    const currGrid = Array(this.rows)
      .fill()
      .map((row, rowId) =>
        Array(this.columns)
          .fill()
          .map((cell, colId) => {
            const currCell = grid[rowId][colId];
            currCell.guessBomb = 0;
            if (currCell.isWild) {
              this.totalWild++;
            }
            return 0;
          }),
      );
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        const currCell = grid[i][j];
        if (currCell.open && currCell.number) {
          if (
            this.iterateAround(i, j, (x, y) => (grid[x][y].open ? 0 : 1)) ===
            currCell.number
          ) {
            this.iterateAround(i, j, (x, y) => {
              if (!grid[x][y].open) {
                currGrid[x][y] = 1;
              }
            });
          }
        }
      }
    }
    this.checkValuesForNextCell(0, 0, 0, currGrid);
    this.setState({ grid });
  };

  product_Range(a, b) {
    var prd = a,
      i = a;

    while (i++ < b) {
      prd *= i;
    }
    return prd;
  }

  combinations(n, r) {
    if (n === r) {
      return 1;
    } else {
      r = r < n - r ? n - r : r;
      return this.product_Range(r + 1, n) / this.product_Range(1, n - r);
    }
  }

  checkValuesForNextCell = (currBombs, currRow, currCol, currGrid) => {
    const { grid } = this.state;
    let nextRow = currRow;
    let nextCol = currCol + 1;

    if (nextCol === this.columns) {
      nextCol = 0;
      nextRow++;
    }

    if (!currCol && currRow === this.rows) {
      const wildBombs = this.bombs - currBombs;
      if (
        wildBombs <= this.totalWild &&
        currGrid.every((row, rowId) =>
          row.every(
            (cell, colId) =>
              !grid[rowId][colId].open ||
              this.iterateAround(rowId, colId, (x, y) => currGrid[x][y]) ===
                grid[rowId][colId].number,
          ),
        )
      ) {
        const wildCombinations = this.combinations(this.totalWild, wildBombs);
        currGrid.forEach((row, rowId) =>
          row.forEach((cell, colId) => {
            if (grid[rowId][colId].isWild) {
              grid[rowId][colId].guessBomb +=
                (wildCombinations * wildBombs) / this.totalWild;
            } else {
              grid[rowId][colId].guessBomb += cell * wildCombinations;
            }
          }),
        );
        this.totalGuesses += wildCombinations;
      }
    } else {
      if (!currGrid[currRow][currCol]) {
        this.checkValuesForNextCell(currBombs, nextRow, nextCol, currGrid);
      }
      const currCel = grid[currRow][currCol];
      if (!currCel.open && currBombs < this.bombs && !currCel.isWild) {
        const nextGrid = JSON.parse(JSON.stringify(currGrid));
        nextGrid[currRow][currCol] = 1;
        this.checkValuesForNextCell(currBombs + 1, nextRow, nextCol, nextGrid);
      }
    }
  };

  render() {
    const { grid } = this.state;
    return (
      <Container maxWidth="lg" style={{ marginTop: '4rem' }}>
        <Grid container spacing={3} style={{ justifyContent: 'center' }}>
          <Grid item style={{ margin: 'auto' }} xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Nível</FormLabel>
              <RadioGroup value={this.state.size} onChange={this.setChanges}>
                <FormControlLabel
                  value="sm"
                  control={<Radio />}
                  label="Fácil"
                />
                <FormControlLabel
                  value="md"
                  control={<Radio />}
                  label="Médio"
                />
                <FormControlLabel
                  value="lg"
                  control={<Radio />}
                  label="Difícil"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item>
            <table style={{ borderCollapse: 'collapse', margin: 'auto' }}>
              <tbody>
                {grid.map((row, idRow) => (
                  <tr key={idRow}>
                    {row.map((cell, idCell) => (
                      <td
                        key={idCell}
                        onClick={() => {
                          this.recursiveOpener(idRow, idCell);
                          this.setState({ grid });
                        }}
                        onContextMenu={(e) => {
                          cell.flag = !cell.flag;
                          this.setState({ grid });
                          e.preventDefault();
                        }}
                        style={{
                          backgroundColor: '#bdbdbd',
                          boxShadow: cell.open
                            ? 'inset 1px 1px 4px 1px #777'
                            : 'inset -1px -1px 4px 1px #333',
                          textAlign: 'center',
                          width: '2rem',
                          height: '2rem',
                          display: 'inline-block',
                        }}
                      >
                        {cell.open ? (
                          cell.bomb ? (
                            <FaBomb
                              size={22}
                              style={{ margin: '0.25rem 0 0 0' }}
                            />
                          ) : (
                            <div
                              style={{
                                color: colors[cell.number],
                                fontSize: '1.41rem',
                                marginTop: '0.125rem',
                              }}
                            >
                              <b>{cell.number || ''}</b>
                            </div>
                          )
                        ) : cell.flag ? (
                          <IoIosFlag
                            size={22}
                            style={{
                              color: 'red',
                              margin: '0.25rem 0 0 0',
                            }}
                          />
                        ) : (
                          cell.guessBomb &&
                          Math.round((100 * cell.guessBomb) / this.totalGuesses)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Grid>
        </Grid>
        <Button onClick={this.calculate} variant="contained">
          Calcular
        </Button>
      </Container>
    );
  }
}
