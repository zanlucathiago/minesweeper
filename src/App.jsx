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
import DocsDialog from './components/DocsDialog';
import helper from './helper';
import BoardGrid from './components/BoardGrid';

export default class App extends React.Component {
  squaresOpened = 0;

  totalGuesses = 0;

  min = {
    guessBomb: null,
  };

  constructor(props) {
    super(props);
    const size = LocalStorage.getLevel();
    this.updateDimensions(size);

    this.state = {
      alert: '',
      alertInfo: '',
      alertSuccess: '',
      dialog: null,
      grid: this.generateGrid(),
      key: false,
      loading: true,
      name: '',
      performance: null,
      player: null,
      running: false,
      size,
      thinking: false,
      victory: false,
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
  }

  askForAuth = () => {
    this.setState({
      name: null,
      player: null,
      dialog: 'login',
      loading: false,
    });
  };

  generateGrid = () => {
    const grid = Array(helper.getRows())
      .fill()
      .map(() =>
        Array(helper.getColumns())
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
    Array(helper.getBombs())
      .fill()
      .forEach(() => {
        let i;
        let j;
        do {
          const index = Math.floor(
            Math.random() * helper.getRows() * helper.getColumns(),
          );
          i = Math.floor(index / helper.getColumns());
          j = index % helper.getColumns();
        } while (grid[i][j].bomb);
        helper.iterateAround(i, j, (row, column) => {
          grid[row][column].number += 1;
        });
        grid[i][j].bomb = true;
      });
    helper.setMin({
      guessBomb: null,
    });
    return grid;
  };

  updateDimensions = (size) => {
    const { bombs, dimensions } = Board[size];
    const [rows, columns] = dimensions;
    helper.setRows(rows);
    helper.setColumns(columns);
    helper.setBombs(bombs);
  };

  setChanges = (size) => {
    const { key } = this.state;
    this.updateDimensions(size);
    LocalStorage.setLevel(size);

    this.setState({
      grid: this.generateGrid(),
      key: !key,
      running: false,
      size,
    });
  };

  calculate = () => {
    helper.setIterations(0);
    const { grid } = this.state;
    helper.setTotalGuesses(0);
    helper.setTotalWild(0);
    const currGrid = Array(helper.getRows())
      .fill()
      .map((row, rowId) =>
        Array(helper.getColumns())
          .fill()
          .map((cell, colId) => {
            const currCell = grid[rowId][colId];
            currCell.guessBomb = 0;
            if (currCell.isWild) {
              helper.incrementTotalWild();
            }
            return -1;
          }),
      );
    for (let i = 0; i < helper.getRows(); i += 1) {
      for (let j = 0; j < helper.getColumns(); j += 1) {
        const currCell = grid[i][j];
        if (currCell.open && currCell.number) {
          if (
            helper.iterateAround(i, j, (x, y) => (grid[x][y].open ? 0 : 1)) ===
            currCell.number
          ) {
            helper.iterateAround(i, j, (x, y) => {
              if (!grid[x][y].open) {
                currGrid[x][y] = 1;
              }
            });
          }
        }
      }
    }

    this.checkValuesForNextCell(0, 0, 0, currGrid);

    helper.setMin(
      _.minBy(
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
      ),
    );

    this.setState({
      alertInfo: helper.getMin().guessBomb
        ? `${Math.round(
            (100 * helper.getMin().guessBomb) / helper.getTotalGuesses(),
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

    if (nextCol === helper.getColumns()) {
      nextCol = 0;
      nextRow += 1;
    }

    if (!currCol && currRow === helper.getRows()) {
      const wildBombs = helper.getBombs() - currBombs;
      if (wildBombs <= helper.getTotalWild()) {
        const wildCombinations = this.combinations(
          helper.getTotalWild(),
          wildBombs,
        );
        currGrid.forEach((row, rowId) =>
          row.forEach((cell, colId) => {
            if (grid[rowId][colId].isWild) {
              grid[rowId][colId].guessBomb +=
                (wildCombinations * wildBombs) / helper.getTotalWild();
            } else {
              grid[rowId][colId].guessBomb += cell * wildCombinations;
            }
          }),
        );
        helper.incrementTotalGuesses(wildCombinations);
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
      if (!currCel.open && currBombs < helper.getBombs() && !currCel.isWild) {
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
    return helper.iterateAround(row, col, (x, y) => {
      if (grid[x][y].open && grid[x][y].number) {
        if (
          helper.iterateAround(x, y, (a, b) =>
            (!grid[a][b].open && currGrid[a][b] < 1) || grid[a][b].open ? 0 : 1,
          ) <= grid[x][y].number &&
          helper.iterateAround(x, y, (a, b) =>
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
    const { grid, key } = this.state;
    helper.setSquaresOpened(0);
    helper.setTotalGuesses(0);
    this.setState(({ running }) => ({
      grid: running ? grid : this.generateGrid(),
      key: running ? key : !key,
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
      key,
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
              <BoardGrid
                grid={grid}
                key={key}
                loseGame={() =>
                  this.setState({ running: false, victory: false })
                }
                running={running}
                winGame={() =>
                  this.setState({
                    running: false,
                    victory: true,
                  })
                }
              />
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
