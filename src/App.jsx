import {
  Button,
  CircularProgress,
  Container,
  Fab,
  Grid,
} from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import { FaBomb, FaPlay, FaStop } from 'react-icons/fa';
import { IoIosFlag, IoMdHelp } from 'react-icons/io';
import Actions from './Actions';
import './App.css';
import Board from './Board.json';
import Alert from './components/Alert';
import FeedbackDialog from './components/FeedbackDialog';
import FormDialog from './components/FormDialog';
import LoginDialog from './components/LoginDialog';
import Progress from './components/Progress';
import SetupDialog from './components/SetupDialog';
import Stopwatch from './components/Stopwatch';
import Toolbar from './components/Toolbar';
import LocalStorage from './LocalStorage';

const colors = ['#000', '#3b71ff', '#417c03', '#ed4f1d', '#193680'];

export default class App extends React.Component {
  squaresOpened = 0;

  constructor(props) {
    super(props);
    const size = LocalStorage.getLevel();
    this.updateDimensions(size);
    const player = LocalStorage.getPlayer();
    this.state = {
      dialog: !player && 'login',
      grid: this.generateGrid(),
      player,
      running: false,
      size,
    };
  }

  totalGuesses = 0;

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
      currCell.open = true;
      if (currCell.bomb) {
        this.squaresOpened = 0;
        return this.setState({
          running: false,
          victory: false,
        });
      }

      this.totalGuesses = 0;
      this.squaresOpened++;
      if (this.squaresOpened === this.rows * this.columns - this.bombs) {
        this.squaresOpened = 0;
        return this.setState({
          running: false,
          victory: true,
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
    this.setState({ grid, thinking: false });
  };

  product_Range(a, b) {
    let prd = a;
    let i = a;

    while (i++ < b) {
      prd *= i;
    }
    return prd;
  }

  combinations(n, r) {
    if (n === r) {
      return 1;
    }
    r = r < n - r ? n - r : r;
    return this.product_Range(r + 1, n) / this.product_Range(1, n - r);
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
      if (wildBombs <= this.totalWild) {
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
      let nextGrid = JSON.parse(JSON.stringify(currGrid));
      nextGrid[currRow][currCol] = 0;
      if (
        currGrid[currRow][currCol] !== 1 &&
        !this.checkAround(currRow, currCol, nextGrid)
      ) {
        this.checkValuesForNextCell(currBombs, nextRow, nextCol, nextGrid);
      }
      const currCel = grid[currRow][currCol];
      if (!currCel.open && currBombs < this.bombs && !currCel.isWild) {
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
        }
        return 1;
      }
      return 0;
    });
  };

  closeDialogs = () => {
    this.setState({ dialog: null });
  };

  openFeedback = () => this.setState({ dialog: 'feedback', victory: false });

  openSettings = () => this.setState({ dialog: 'setup' });

  openForm = () => this.setState({ dialog: 'form' });

  render() {
    const {
      alert,
      alertInfo,
      alertSuccess,
      dialog,
      grid,
      loading,
      name,
      player,
      thinking,
      performance,
      running,
      size,
      victory,
    } = this.state;
    return (
      <div>
        {dialog === 'form' && (
          <FormDialog
            handleClose={(alertSuccess) => {
              if (alertSuccess) {
                this.setState({ alertSuccess });
              }
              this.closeDialogs();
            }}
          />
        )}
        <Toolbar
          name={name}
          _id={player}
          openFeedback={this.openFeedback}
          openForm={this.openForm}
          openSettings={this.openSettings}
        />
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
          {alert && (
            <Alert
              onClose={() => this.setState({ alert: null })}
              severity="error"
            >
              {alert}
            </Alert>
          )}
          {alertSuccess && (
            <Alert
              onClose={() => this.setState({ alertSuccess: null })}
              severity="success"
            >
              {alertSuccess}
            </Alert>
          )}
          {alertInfo && (
            <Alert
              autoHideDuration={21000}
              onClose={() => this.setState({ alertInfo: null })}
              severity="info"
              vertical="top"
            >
              {alertInfo}
            </Alert>
          )}
          {loading && <Progress />}
          {dialog === 'login' && (
            <LoginDialog
              onStart={(player, name) => {
                this.setState({ alertSuccess: 'Bom jogo!', player, name });
                LocalStorage.setPlayer(player);
                this.closeDialogs();
              }}
            />
          )}
          {dialog === 'feedback' && (
            <FeedbackDialog
              handleClose={this.closeDialogs}
              title={`${victory ? 'Você venceu!' : 'Tabela de recordes!'}`}
              content={
                victory &&
                `Tempo: ${
                  performance
                    ? moment()
                        .minute(0)
                        .second(0)
                        .millisecond(performance)
                        .format('mm:ss.SSS')
                    : '01:23:456'
                }`
              }
            />
          )}
          {dialog === 'setup' && (
            <SetupDialog
              handleClose={this.closeDialogs}
              setChanges={this.setChanges}
              size={size}
            />
          )}
          <Grid container spacing={3} style={{ justifyContent: 'center' }}>
            <Grid
              item
              style={{ margin: 'auto', textAlign: 'center' }}
              xs={6}
              // sm={4}
            >
              <Stopwatch
                saveRecord={(performance) => {
                  const { victory } = this.state;
                  // this.setState({ dialog: 'feedback', perf })
                  if (victory) {
                    Actions.addRecord({
                      player,
                      performance,
                      level: LocalStorage.getLevel(),
                    }).then(() => {
                      this.setState({ dialog: 'feedback', loading: false });
                    });
                    this.setState({ loading: true, performance });
                  } else {
                    this.setState({ alert: 'Jogo encerrado.' });
                  }
                }}
                running={running}
              />
            </Grid>
            <Grid
              item
              style={{ margin: 'auto', textAlign: 'center' }}
              xs={6}
              // sm={4}
            >
              <Button
                onClick={() => {
                  this.squaresOpened = 0;
                  this.totalGuesses = 0;
                  this.setState(({ running }) => ({
                    grid: running ? grid : this.generateGrid(),
                    running: !running,
                    victory: false,
                  }));
                }}
                // size="large"
                variant="contained"
                color="primary"
                endIcon={running ? <FaStop /> : <FaPlay />}
              >
                {running ? 'Parar' : 'Iniciar'}
              </Button>
            </Grid>
            {/* <Grid
              item
              style={{ margin: 'auto', textAlign: 'center' }}
              xs={12}
              sm={4}
            > */}
            {/* <IconButton
                color="primary"
                // disabled={running}
                onClick={() =>
                  this.setState({ dialog: 'feedback', victory: false })
                }
              >
                <FaListOl />
              </IconButton> */}
            {/* <IconButton
                color="primary"
                disabled={running}
                onClick={() => this.setState({ dialog: 'setup' })}
              >
                <FaTools />
              </IconButton> */}
            {/* <IconButton
                onClick={() =>
                  this.setState({
                    alertInfo: (
                      <Typography>
                        O botão de interrogação no canto inferior direito da
                        tela calcula e mostra os melhores lugares para arriscar
                        um palpite. Quanto mais próximo de 0, menos chance de
                        ter uma bomba. Quanto mais próximo de 100, mais chance
                        de ter uma bomba.
                      </Typography>
                    ),
                  })
                }
                // style={{ position: 'absolute', padding: 4, right: 0 }}
              >
                <FaQuestionCircle />
              </IconButton>
            </Grid> */}
          </Grid>
          <Grid
            item
            style={{
              margin: '1.5rem 0.5rem 6rem',
              // marginBottom: '6rem',
              overflowY: 'hidden',
            }}
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
                                userSelect: 'none',
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
                              color: '#777',
                              // backgroundColor: `rgba(0,0,0,${cell.guessBomb /
                              //   this.totalGuesses})`,
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
            disabled={!running || thinking}
            onClick={() => {
              this.setState({ thinking: true });
              setTimeout(this.calculate, 125);
            }}
          >
            <IoMdHelp size={32} />
          </Fab>
          {thinking && (
            <CircularProgress
              size={68}
              style={{
                position: 'fixed',
                right: 26,
                bottom: 26,
                zIndex: 1,
              }}
            />
          )}
        </Container>
      </div>
    );
  }
}
