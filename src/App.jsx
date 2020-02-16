import {
  Button,
  CircularProgress,
  Container,
  Fab,
  Grid,
} from '@material-ui/core';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { FaPlay, FaStop } from 'react-icons/fa';
import { IoMdHelp } from 'react-icons/io';
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
import Cell from './components/Cell';
import DocsDialog from './components/DocsDialog';

// const colors = ['#000', '#3b71ff', '#417c03', '#ed4f1d', '#193680'];

export default class App extends React.Component {
  squaresOpened = 0;

  totalGuesses = 0;

  min = {};

  constructor(props) {
    super(props);
    const size = LocalStorage.getLevel();
    this.updateDimensions(size);
    // const player = LocalStorage.getPlayer();

    // Actions.getPlayer({ slug: _.kebabCase(player) })
    // .then(() =>
    //   this.setState({
    //     alert: 'Já existe um usuario com este nome!',
    //     loading: false,
    //   }),
    // )
    // .catch(({ response }) =>
    //   response.status === 404
    //     ? this.setState({ createPIN: true, loading: false })
    //     : this.setState({ alert: response.data, loading: false }),
    // );
    this.setState({ loading: true });

    this.state = {
      // dialog: 'login',
      grid: this.generateGrid(),
      loading: true,
      // player,
      running: false,
      size,
    };
  }

  componentDidMount() {
    // eslint-disable-next-line
    const _id = LocalStorage.getPlayer();
    Actions.getPlayer({ _id })
      .then(({ data }) =>
        this.setState({
          player: _id,
          name: data.name,
          dialog: null,
          loading: false,
        }),
      )
      .catch(this.askForAuth);

    // this.askForAuth();
  }

  // validatePlayer = () => {

  // };

  askForAuth = () => {
    this.setState({
      name: null,
      player: null,
      dialog: 'login',
      loading: false,
    });
  };

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
      row += 1
    ) {
      for (
        let column = Math.max(0, j - 1);
        column <= Math.min(this.columns - 1, j + 1);
        column += 1
      ) {
        if (row !== i || column !== j) {
          res += callback(row, column);
        }
      }
    }
    return res;
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
    this.setState({ grid: this.generateGrid(), running: false, size });
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
              this.totalWild += 1;
            }
            return -1;
          }),
      );
    for (let i = 0; i < this.rows; i += 1) {
      for (let j = 0; j < this.columns; j += 1) {
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

    this.min = _.minBy(
      _.filter(
        grid.map((row, rowId) =>
          _.minBy(
            _.filter(
              row.map((o, colId) => {
                if (!o.guessBomb) {
                  grid[rowId][colId].noBomb = true;
                }
                return o;
              }),
              ['open', false],
            ),
            'guessBomb',
          ),
        ),
        (o) => o,
      ),
      'guessBomb',
    );

    this.setState({
      alertInfo: this.min.guessBomb
        ? `${Math.round(
            (100 * this.min.guessBomb) / this.totalGuesses,
          )}% de chance de ter mina na região destacada em verde.`
        : `A região destacada em azul não tem minas!`,
      grid,
      thinking: false,
    });
  };

  checkValuesForNextCell = (currBombs, currRow, currCol, currGrid) => {
    const { grid } = this.state;
    let nextRow = currRow;
    let nextCol = currCol + 1;

    if (nextCol === this.columns) {
      nextCol = 0;
      nextRow += 1;
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

  openFeedback = () => {
    this.setState({ dialog: 'feedback', victory: false });
  };

  openSettings = () => {
    this.setState({ dialog: 'setup' });
  };

  openForm = () => {
    this.setState({ dialog: 'form' });
  };

  productRange = (a, b) => {
    let prd = a;
    let i = a;

    while (i < b) {
      prd *= i;
      i += 1;
    }
    return prd;
  };

  combinations = (n, r) => {
    const diff = n - r;
    if (!diff) {
      return 1;
    }
    const major = Math.max(diff, r);
    return this.productRange(major + 1, n) / this.productRange(1, n - major);
  };

  onClickPlay = () => {
    const { grid } = this.state;
    this.squaresOpened = 0;
    this.totalGuesses = 0;
    this.setState(({ running }) => ({
      grid: running ? grid : this.generateGrid(),
      running: !running,
      victory: false,
    }));
  };

  startGame = (player, name) => {
    this.setState({ alertSuccess: 'Bom jogo!', player, name });
    LocalStorage.setPlayer(player);
    this.closeDialogs();
  };

  saveRecord = (performance) => {
    const { player, victory } = this.state;
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
  };

  openingPostScripts = (cell, idRow, idCell) => {
    const { grid } = this.state;

    grid[idRow][idCell].open = true;
    grid[idRow][idCell].isWild = false;
    if (cell.bomb) {
      this.squaresOpened = 0;
      this.totalGuesses = 0;
      return this.setState({ running: false, victory: false });
      // return loseGame(false);
    }
    // cell.isWild = false;

    if (this.totalGuesses) {
      this.setState({ grid });
    }

    // zerando contagens
    this.totalGuesses = 0;
    this.min = {};

    this.squaresOpened += 1;

    // se houve vitória
    if (this.squaresOpened === this.rows * this.columns - this.bombs) {
      this.squaresOpened = 0;
      // this.totalGuesses = 0;
      return this.setState({
        running: false,
        victory: true,
      });
    }

    // Se o valor da célula é zero, iterar ao redor e abrir mais!
    if (!cell.number) {
      this.iterateAround(idRow, idCell, (curRow, curColumn) => {
        // Apenas setar como open. Isso vai ativar os gatilhos no componentWillReceiveProps de cada celula
        grid[curRow][curColumn].open = true;
      });
      // Chamar o render para ativar os gatilhos
      this.setState({ grid });
    } else {
      this.iterateAround(idRow, idCell, (curRow, curColumn) => {
        // Atualizando dados para solicitações de ajuda
        grid[curRow][curColumn].isWild = false;
      });
    }

    return null;
  };

  openDocs = () => {
    this.setState({ dialog: 'docs' });
  };

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
    // const { grid } = this.state;
    return (
      <div>
        {dialog === 'form' && (
          <FormDialog
            handleClose={(msg) => {
              if (msg) {
                this.setState({ alertSuccess: msg });
              }
              this.closeDialogs();
            }}
          />
        )}
        {dialog === 'docs' && <DocsDialog handleClose={this.closeDialogs} />}
        <Toolbar
          logout={this.askForAuth}
          name={name}
          _id={player}
          openDocs={this.openDocs}
          openFeedback={this.openFeedback}
          openForm={this.openForm}
          openSettings={this.openSettings}
        />
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
          {alert && (
            <Alert
              onClose={() => {
                this.setState({ alert: null });
              }}
              severity="error"
            >
              {alert}
            </Alert>
          )}
          {alertSuccess && (
            <Alert
              onClose={() => {
                this.setState({ alertSuccess: null });
              }}
              severity="success"
            >
              {alertSuccess}
            </Alert>
          )}
          {alertInfo && (
            <Alert
              // autoHideDuration={21000}
              onClose={() => {
                this.setState({ alertInfo: null });
              }}
              severity="info"
              vertical="top"
            >
              {alertInfo}
            </Alert>
          )}
          {loading && <Progress />}
          {dialog === 'login' && <LoginDialog onStart={this.startGame} />}
          {dialog === 'feedback' && (
            <FeedbackDialog
              handleClose={this.closeDialogs}
              // title={`${victory ? 'Você venceu!' : 'Tabela de recordes!'}`}
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
            <Grid item style={{ margin: 'auto', textAlign: 'center' }} xs={6}>
              <Stopwatch saveRecord={this.saveRecord} running={running} />
            </Grid>
            <Grid item style={{ margin: 'auto', textAlign: 'center' }} xs={6}>
              <Button
                onClick={this.onClickPlay}
                variant="contained"
                color="primary"
                endIcon={running ? <FaStop /> : <FaPlay />}
              >
                {running ? 'Parar' : 'Iniciar'}
              </Button>
            </Grid>
          </Grid>
          <Grid
            item
            style={{
              margin: '1.5rem 0.5rem 6rem',
              overflowY: 'hidden',
            }}
          >
            <table
              role="grid"
              style={{
                borderCollapse: 'collapse',
                margin: 'auto',
                opacity: running ? 1 : 0.5,
                whiteSpace: 'nowrap',
              }}
            >
              <tbody>
                {grid.map((row, idRow) => (
                  <tr key={idRow.toString()}>
                    {row.map((cell, idCell) => (
                      <Cell
                        // backgroundColor={this.setBackgroundColor(cell)}
                        cell={cell}
                        // changeVictory={(value) => {

                        // }}
                        guessBomb={this.min.guessBomb}
                        openingPostScripts={() =>
                          this.openingPostScripts(cell, idRow, idCell)
                        }
                        key={`${idCell.toString()}${running}`}
                        // rows={this.rows}
                        running={running}
                        // squareOpen={() => {
                        // }}
                        // squaresOpened={this.squaresOpened}
                      />
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
