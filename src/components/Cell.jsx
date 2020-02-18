import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FaBomb } from 'react-icons/fa';
import { IoIosFlag } from 'react-icons/io';
import helper from '../helper';

const colors = ['#000', '#3b71ff', '#417c03', '#ed4f1d', '#193680'];

class Cell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      open: false,
    };
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.open && nextProps.cell.open) {
      this.recursiveOpener();
    }
  }

  setBackgroundColor = () => {
    const { cell } = this.props;
    // const { guessBomb, noBomb, open } = cell;

    if (!cell.open) {
      if (cell.noBomb) {
        return '#5BB';
      }
      if (helper.getMin().guessBomb === cell.guessBomb) {
        return '#BB5';
      }
    }
    return '#BBB';
  };

  recursiveOpener = () => {
    const {
      cell,
      loseGame,
      openAround,
      refreshBoard,
      running,
      updateWilds,
      winGame,
    } = this.props;
    const { flag, open } = this.state;

    if (!open && !flag && running) {
      this.open = true;
      this.setState({ open: true });
      // openingPostScripts();

      // const { grid } = this.state;

      // cell.open = true;
      // cell.isWild = false;
      // if (cell.bomb) {
      //   helper.setSquaresOpened(0);
      //   helper.setTotalGuesses(0);
      //   return loseGame();
      //   // return loseGame(false);
      // }
      // // cell.isWild = false;

      // if (helper.getTotalGuesses()) {
      //   refreshBoard();
      // }

      // // zerando contagens
      // helper.setTotalGuesses(0);
      // helper.setMin({
      //   guessBomb: null,
      // });

      // helper.incrementSquaresOpened();

      // // se houve vitória
      // if (
      //   helper.getSquaresOpened() ===
      //   helper.getRows() * helper.getColumns() - helper.getBombs()
      // ) {
      //   helper.setSquaresOpened(0);
      //   // this.totalGuesses = 0;
      //   return winGame();
      // }

      // Se o valor da célula é zero, iterar ao redor e abrir mais!
      if (!cell.number) {
        openAround();
        // Chamar o render para ativar os gatilhos
        refreshBoard();
      } else {
        // updateWilds();
      }

      return null;
    }

    return null;
  };

  renderCell = () => {
    const { cell } = this.props;
    const { bomb, number } = cell;
    const { flag, open } = this.state;
    if (open) {
      if (bomb) {
        return <FaBomb size={22} style={{ margin: '0.25rem 0 0 0' }} />;
      }
      return (
        <div
          style={{
            color: colors[number],
            fontSize: '1.41rem',
            marginTop: '0.125rem',
            userSelect: 'none',
          }}
        >
          <b>{number || ''}</b>
        </div>
      );
    }
    if (flag) {
      return (
        <IoIosFlag
          size={22}
          style={{
            color: 'red',
            margin: '0.25rem 0 0 0',
          }}
        />
      );
    }
    return null;
  };

  render() {
    const { cell } = this.props;
    const { flag, open } = this.state;
    return (
      <td
        // key={cell}
        onClick={() => {
          this.recursiveOpener();
        }}
        // onContextMenu={(e) => {
        //   cell.flag = !cell.flag;
        //   this.setState({ flag: !flag });
        //   e.preventDefault();
        // }}
        role="gridcell"
        style={{
          backgroundColor: this.setBackgroundColor(),
          boxShadow: open
            ? 'inset 1px 1px 4px 1px #777'
            : 'inset -1px -1px 4px 1px #333',
          textAlign: 'center',
          width: '2rem',
          height: '2rem',
          display: 'inline-block',
        }}
      >
        {this.renderCell()}
      </td>
    );
  }
}

Cell.defaultProps = {
  guessBomb: null,
};

Cell.propTypes = {
  // backgroundColor: PropTypes.string.isRequired,
  cell: PropTypes.exact({
    flag: PropTypes.bool,
    guessBomb: PropTypes.number,
    isWild: PropTypes.bool,
    open: PropTypes.bool,
    bomb: PropTypes.bool,
    number: PropTypes.number,
  }).isRequired,
  // changeVictory: PropTypes.func.isRequired,
  guessBomb: PropTypes.number,
  openingPostScripts: PropTypes.func.isRequired,
  running: PropTypes.bool.isRequired,
};

export default Cell;
