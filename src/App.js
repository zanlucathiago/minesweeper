import { FaBomb, FaPlay, FaTools, FaStop } from 'react-icons/fa';
import { IoIosFlag, IoMdHelp } from 'react-icons/io';
// import { MdLiveHelp } from 'react-icons/md';
import React from 'react';
import './App.css';
import Board from './Board.json';
import {
  Container,
  Grid,
  Button,
  // FormControl,
  // FormLabel,
  // RadioGroup,
  // FormControlLabel,
  // Radio,
  IconButton,
  Fab,
  CircularProgress,
  // Icon,
} from '@material-ui/core';
// import Icon from '@material-ui/core/Icon';
import LocalStorage from './LocalStorage';
import Stopwatch from './components/Stopwatch';
import FeedbackDialog from './components/FeedbackDialog';
import SetupDialog from './components/SetupDialog';
import moment from 'moment';

const colors = ['#000', '#3b71ff', '#417c03', '#ed4f1d', '#193680'];

export default class App extends React.Component {
  // bombs = 5;
  // rows = 7;
  // columns = 7;
  squaresOpened = 0;

  constructor(props) {
    super(props);
    const size = LocalStorage.getLevel();
    this.updateDimensions(size);
    this.state = {
      grid: this.generateGrid(),
      running: false,
      size,
    };
  }

  // componentDidUpdate(prevProps, prevState) {
  // if (this.status) {
  // if (prompt(this.status)) {
  //   this.setState({ running: true });
  // }
  // this.status = null;
  // this.squaresOpened = 0;
  // this
  // this.setState({ running: false, grid: this.generateGrid() });
  // }
  // if (this.state.loading && !prevState.loading) {
  // this.calculate();
  // }
  // }

  generateGrid = () => {
    const grid = Array(this.rows)
      .fill()
      .map(() =>
        Array(this.columns)
          .fill()
          .map(() => ({
            bomb: false,
            flag: false,
            guessBomb: 0,
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
    const { grid, running } = this.state;
    const currCell = grid[row][column];
    if (!currCell.open && !currCell.flag && running) {
      if (currCell.bomb) {
        // this.status = 'Você perdeu. Clique para recomeçar.';
        this.setState({
          running: false,
          // dialog: 'feedback',
          message: 'Você perdeu.',
        });
      }

      currCell.open = true;
      this.totalGuesses = 0;
      this.squaresOpened++;
      // console.log(this.squaresOpened);
      if (this.squaresOpened === this.rows * this.columns - this.bombs) {
        // this.status = 'Você venceu! Clique para recomeçar.';
        this.setState({
          running: false,
          // dialog: 'feedback',
          message: 'Você venceu!.',
        });
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

  setChanges = (size) => {
    // const size = e.target.value;
    this.updateDimensions(size);
    LocalStorage.setLevel(size);
    this.setState({ grid: this.generateGrid(), size });
  };

  totalGuesses = 0;

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
            return -1;
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
    this.setState({ grid, loading: false });
    // res();
  };

  product_Range(a, b) {
    let prd = a,
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
        wildBombs <= this.totalWild // &&
        // currGrid.every((row, rowId) =>
        //   row.every(
        //     (cell, colId) =>
        //       !grid[rowId][colId].open ||
        //       this.iterateAround(rowId, colId, (x, y) => currGrid[x][y]) ===
        //         grid[rowId][colId].number,
        //   ),
        // )
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
      // let nextGrid;
      // if (currGrid[currRow][currCol] < 1) {
      // nextGrid = JSON.parse(JSON.stringify(currGrid));
      let nextGrid = JSON.parse(JSON.stringify(currGrid));
      nextGrid[currRow][currCol] = 0;
      if (
        currGrid[currRow][currCol] !== 1 &&
        !this.checkAround(currRow, currCol, nextGrid)
      ) {
        this.checkValuesForNextCell(currBombs, nextRow, nextCol, nextGrid);
      }
      // }
      const currCel = grid[currRow][currCol];
      if (
        !currCel.open &&
        currBombs < this.bombs &&
        !currCel.isWild // &&
        // currGrid[currRow][currCol]
      ) {
        nextGrid = JSON.parse(JSON.stringify(currGrid));
        nextGrid[currRow][currCol] = 1;
        if (
          currGrid[currRow][currCol] === 1 ||
          !this.checkAround(currRow, currCol, nextGrid)
        ) {
          this.checkValuesForNextCell(
            currBombs + 1,
            nextRow,
            nextCol,
            nextGrid,
          );
        }
      }
    }
  };

  checkAround = (row, col, currGrid) => {
    const { grid } = this.state;
    // let error = false;
    return this.iterateAround(row, col, (x, y) => {
      if (grid[x][y].open && grid[x][y].number) {
        if (
          this.iterateAround(x, y, (a, b) =>
            (!grid[a][b].open && currGrid[a][b] < 1) || grid[a][b].open ? 0 : 1,
          ) <= grid[x][y].number &&
          this.iterateAround(x, y, (a, b) =>
            (!grid[a][b].open && !currGrid[a][b]) || grid[a][b].open ? 0 : 1,
          ) >= grid[x][y].number
        ) {
          return 0;
        } else {
          return 1;
        }
      }
      return 0;
    });
  };

  render() {
    const { dialog, grid, loading, message, perf, running, size } = this.state;
    return (
      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        {dialog === 'feedback' && (
          <FeedbackDialog
            handleClose={() => this.setState({ dialog: null })}
            message={`${message} Seu tempo foi ${moment()
              // .hour(0)
              .minute(0)
              .second(0)
              .millisecond(perf)
              .format('mm:ss.SSS')}.`}
          />
        )}
        {dialog === 'setup' && (
          <SetupDialog
            handleClose={() => this.setState({ dialog: null })}
            setChanges={this.setChanges}
            size={size}
          />
        )}
        <Grid container spacing={3} style={{ justifyContent: 'center' }}>
          <Grid
            item
            style={{ margin: 'auto', textAlign: 'center' }}
            xs={12}
            sm={4}
          >
            <Stopwatch
              openFeedback={(perf) =>
                this.setState({ dialog: 'feedback', perf })
              }
              running={running}
            />
          </Grid>
          <Grid
            item
            style={{ margin: 'auto', textAlign: 'center' }}
            xs={12}
            sm={4}
          >
            <Button
              onClick={() => {
                this.squaresOpened = 0;
                this.totalGuesses = 0;
                this.setState(({ running }) => ({
                  grid: running ? grid : this.generateGrid(),
                  running: !running,
                  message: running && 'Você perdeu.',
                }));
              }}
              size="large"
              variant="contained"
              color="primary"
              // className={classes.button}
              endIcon={running ? <FaStop /> : <FaPlay />}
              // startIcon={<FaPlay />}
            >
              {running ? 'Parar' : 'Iniciar'}
            </Button>
          </Grid>
          <Grid
            item
            style={{ margin: 'auto', textAlign: 'center' }}
            xs={12}
            sm={4}
          >
            <IconButton
              color="primary"
              disabled={running}
              onClick={() => this.setState({ dialog: 'setup' })}
            >
              <FaTools />
            </IconButton>
          </Grid>
        </Grid>
        <Grid
          item
          style={{ margin: '1rem', marginBottom: '6rem', overflowY: 'hidden' }}
        >
          <table
            style={{
              borderCollapse: 'collapse',
              margin: 'auto',
              opacity: running ? 1 : 0.5,
              whiteSpace: 'nowrap',
            }}
          >
            <tbody>
              {grid.map((row, idRow) => (
                <tr
                  key={idRow}
                  // style={{ whiteSpace: 'nowrap', position: 'absolute' }}
                  // style={{ whiteSpace: 'nowrap', position: 'absolute' }}
                >
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
                      ) : this.totalGuesses ? (
                        <div
                          style={{
                            // color: `rgba(0,0,0,${cell.guessBomb /
                            // this.totalGuesses})`,
                            color: '#777',
                            // fontSize: '1.41rem',
                            marginTop: '0.375rem',
                          }}
                        >
                          {Math.round(
                            (100 * cell.guessBomb) / this.totalGuesses,
                          )}
                        </div>
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Grid>
        <Fab
          color="secondary"
          style={{ position: 'fixed', right: '2rem', bottom: '2rem' }}
          disabled={!running || loading}
          // endIcon={<MdLiveHelp />}
          onClick={() => {
            // this.setState({ loading: true }, () => this.calculate());
            this.setState({ loading: true });
            setTimeout(this.calculate, 125);
          }}
        >
          <IoMdHelp size={32} />
        </Fab>
        {loading && (
          <CircularProgress
            size={68}
            style={{
              // color: green[500],
              position: 'fixed',
              right: 26,
              bottom: 26,
              zIndex: 1,
            }}
          />
        )}
        {/* <Grid
          item
          style={{ margin: 'auto', textAlign: 'center', marginBottom: '2rem' }}
          // xs={12}
          // sm={4}
        >
          <Button
            disabled={!running}
            endIcon={<MdLiveHelp />}
            onClick={this.calculate}
            variant="contained"
          >
            Ajuda
          </Button>
        </Grid> */}
      </Container>
    );
  }
}
