import { CircularProgress, Container, Fab, Grid } from '@material-ui/core';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { FaPlay } from 'react-icons/fa';
import { IoMdHelp } from 'react-icons/io';
import Actions from './Actions';
import './App.css';
import Board from './Board.json';
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
import AboutDialog from './components/AboutDialog';
import UserDialog from './components/UserDialog';
import TimeField from './components/TimeField';
import BombCounter from './components/BombCounter';

class App extends React.Component {
  constructor(props) {
    super(props);
    const size = LocalStorage.getLevel();
    this.updateDimensions(size);

    this.state = {
      currentPlayerRecords: [],
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
    const _id = LocalStorage.getPlayer('player');
    this.fetchDisplayRecords();

    if (_id) {
      if (new URLSearchParams(window.location.search).get('low') !== 'true') {
        this.fetchPicture(_id);
      }

      this.setState({
        player: _id,
        name: LocalStorage.getPlayer('name'),
        dialog: null,
        loading: false,
      });
    } else {
      this.askForAuth();
    }
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

  fetchDisplayRecords = () => {
    Actions.getRecords().then(({ data }) => {
      const [, records] = data;
      this.updateRecords(records);
    });
  };

  updateRecords = (records) => {
    const { length } = records;

    this.setState({
      currentPlayerRecords: records,
      worldRecord: length ? records[0].performance : null,
      lastRecord: length ? records[length - 1].performance : null,
    });
  };

  setChanges = (size) => {
    const { updateFlags } = this.props;
    const { key } = this.state;
    this.updateDimensions(size);
    LocalStorage.setLevel(size);
    updateFlags();
    this.fetchDisplayRecords();

    this.setState({
      grid: this.generateGrid(),
      key: !key,
      running: false,
      size,
    });
  };

  calculate = () => {
    const { alertError, alertInfo } = this.props;
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

    if (!helper.getError()) {
      const guessesMatrix = grid.map((row, rowId) => {
        const guessesList = row.map((o, colId) => {
          if (!o.guessBomb) {
            grid[rowId][colId].noBomb = true;
          }

          return o;
        });

        return _.minBy(_.filter(guessesList, ['open', false]), 'guessBomb');
      });

      helper.setMin(
        _.minBy(
          _.filter(guessesMatrix, (o) => o),
          'guessBomb',
        ),
      );

      alertInfo(
        helper.getMin().guessBomb
          ? `${Math.round(
              (100 * helper.getMin().guessBomb) / helper.getTotalGuesses(),
            )}% de chance de ter mina na região destacada em verde.`
          : `A região destacada em azul não tem minas!`,
        { vertical: 'top' },
      );

      this.setState({
        grid,
      });
    } else {
      helper.setError(false);
      alertError('Não foi possivel requerer ajuda, tente novamente mais tarde');
    }

    this.setState({ thinking: false });
  };

  checkValuesForNextCell = (currBombs, currRow, currCol, currGrid) => {
    if (!helper.getError()) {
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

          if (wildCombinations) {
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
          } else {
            helper.setError(true);
          }
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

  fetchPicture = (_id) =>
    Actions.downloadImage(_id).then((response) =>
      this.setState({ fileURL: URL.createObjectURL(new Blob([response])) }),
    );

  startGame = (player, name) => {
    const { alertSuccess } = this.props;
    this.fetchPicture(player);
    alertSuccess('Bom jogo!');
    this.setState({ player, name });
    LocalStorage.setPlayer(player, name);
    this.fetchDisplayRecords();
    this.closeDialogs();
  };

  saveRecord = (performance) => {
    const { alertError, alertSuccess } = this.props;
    const { currentPlayerRecords, player, victory, worldRecord } = this.state;

    if (victory) {
      const record = {
        player,
        performance,
        level: LocalStorage.getLevel(),
      };

      Actions.addRecord(record)
        .then(() => this.setState({ dialog: 'feedback', loading: false }))
        .catch(() => {
          alertSuccess(
            'Você venceu! O seu tempo será sincronizado quando houver conexão.',
          );

          LocalStorage.addRecord(record);

          this.setState({
            loading: false,
          });
        });

      const { length } = currentPlayerRecords;

      const idx = _.findIndex(
        currentPlayerRecords,
        (o) => o.performance >= performance,
      );

      this.setState({
        loading: true,
        performance,
        rating: length - (idx === -1 ? length : idx),
        worldRecord: Math.min(worldRecord, performance),
        lastRecord: performance,
      });
    } else {
      alertError('Jogo encerrado.');
    }
  };

  openDocs = () => {
    this.setState({ dialog: 'docs' });
  };

  openAbout = () => {
    this.setState({ dialog: 'about' });
  };

  openUser = () => {
    this.setState({ dialog: 'user' });
  };

  confirmSavedUser = (fileURL) => {
    const { alertSuccess } = this.props;
    alertSuccess('Alterações gravadas');

    this.setState({
      dialog: null,
      fileURL,
    });
  };

  render() {
    const { alertError, alertInfo, alertSuccess, alertWarning } = this.props;

    const {
      dialog,
      fileURL,
      grid,
      key,
      lastRecord,
      loading,
      name,
      player,
      thinking,
      performance,
      rating,
      running,
      size,
      victory,
      worldRecord,
    } = this.state;

    return (
      <div>
        {dialog === 'user' && (
          <UserDialog
            alertError={alertError}
            fileURL={fileURL}
            handleClose={this.closeDialogs}
            handleSave={this.confirmSavedUser}
            name={name}
            _id={player}
          />
        )}
        {dialog === 'form' && (
          <FormDialog
            alertError={alertError}
            handleClose={(msg) => {
              if (msg) {
                alertSuccess(msg);
              }

              this.closeDialogs();
            }}
          />
        )}
        {dialog === 'docs' && <DocsDialog handleClose={this.closeDialogs} />}
        <Toolbar
          fileURL={fileURL}
          logout={this.askForAuth}
          name={name}
          _id={player}
          openAbout={this.openAbout}
          openDocs={this.openDocs}
          openFeedback={this.openFeedback}
          openForm={this.openForm}
          openSettings={this.openSettings}
          openUser={this.openUser}
        />
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
          {loading && <Progress />}
          {dialog === 'login' && (
            <LoginDialog
              alertError={alertError}
              alertWarning={alertWarning}
              onStart={this.startGame}
            />
          )}
          {dialog === 'feedback' && (
            <FeedbackDialog
              alertError={alertError}
              alertInfo={alertInfo}
              handleClose={this.closeDialogs}
              content={
                victory &&
                `Tempo: ${moment()
                  .minute(0)
                  .second(0)
                  .millisecond(performance)
                  .format('mm:ss.SSS')}`
              }
              rating={rating}
              updateRecords={this.updateRecords}
            />
          )}
          {dialog === 'setup' && (
            <SetupDialog
              handleClose={this.closeDialogs}
              setChanges={this.setChanges}
              size={size}
            />
          )}
          {dialog === 'about' && (
            <AboutDialog handleClose={this.closeDialogs} />
          )}
          <Grid container spacing={3} style={{ justifyContent: 'center' }}>
            <Grid
              item
              style={{ margin: 'auto', textAlign: 'center' }}
              xs={6}
              md={3}
            >
              <TimeField key={key} label="Menor tempo" value={worldRecord} />
            </Grid>
            <Grid
              item
              style={{ margin: 'auto', textAlign: 'center' }}
              xs={6}
              md={3}
            >
              <TimeField key={key} label="Último tempo" value={lastRecord} />
            </Grid>
            <Grid
              item
              style={{ margin: 'auto', textAlign: 'center' }}
              xs={6}
              md={3}
            >
              <BombCounter />
            </Grid>
            <Grid
              item
              style={{ margin: 'auto', textAlign: 'center' }}
              xs={6}
              md={3}
            >
              <Stopwatch saveRecord={this.saveRecord} running={running} />
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
                onClickPlay={this.onClickPlay}
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
          {running ? (
            <Fab
              color="primary"
              style={{ position: 'fixed', right: '2rem', bottom: '2rem' }}
              disabled={thinking}
              onClick={() => {
                this.setState({ thinking: true });
                setTimeout(this.calculate, 125);
              }}
            >
              <IoMdHelp size={32} />
            </Fab>
          ) : (
            <Fab
              color="secondary"
              style={{ position: 'fixed', right: '2rem', bottom: '2rem' }}
              onClick={this.onClickPlay}
            >
              <FaPlay size={23} />
            </Fab>
          )}
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

export default App;
