import React, { Component } from 'react';
import { FaBomb } from 'react-icons/fa';
import { IoIosFlag } from 'react-icons/io';

const colors = ['#000', '#3b71ff', '#417c03', '#ed4f1d', '#193680'];

class Cell extends Component {
  recursiveOpener = (row, column) => {
    const {
      bombs,
      changeVictory,
      columns,
      grid,
      iterateAround,
      rows,
      running,
      squareOpen,
      squaresOpened,
    } = this.props;
    const currCell = grid[row][column];
    if (!currCell.open && !currCell.flag && running) {
      currCell.open = true;
      if (currCell.bomb) {
        return changeVictory(false);
      }
      squareOpen();
      console.log(squaresOpened);
      if (squaresOpened + 1 === rows * columns - bombs) {
        return changeVictory(true);
      }
      currCell.isWild = false;
      if (!currCell.number) {
        iterateAround(row, column, (curRow, curColumn) => {
          this.recursiveOpener(curRow, curColumn);
        });
      } else {
        iterateAround(row, column, (curRow, curColumn) => {
          grid[curRow][curColumn].isWild = false;
        });
      }
    }

    return null;
  };

  renderCell = ({ open, bomb, number, flag }) => {
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
    // if (this.totalGuesses) {
    //   // if (this.min && this.min.guessBomb === guessBomb) {
    //   return (
    //     <div
    //       style={{
    //         // backgroundColor: '#5BB',
    //         color: '#777',
    //         marginTop: '0.375rem',
    //       }}
    //     >
    //       {Math.round((100 * guessBomb) / this.totalGuesses)}
    //     </div>
    //   );
    // }
    return null;
  };

  render() {
    const { cell, changeGrid, guessBomb, idRow, idCell, grid } = this.props;
    return (
      <td
        key={cell}
        onClick={() => {
          this.recursiveOpener(idRow, idCell);
          changeGrid(grid);
        }}
        onContextMenu={(e) => {
          grid[idRow][idCell].flag = !cell.flag;
          changeGrid(grid);
          e.preventDefault();
        }}
        role="gridcell"
        style={{
          backgroundColor:
            guessBomb === cell.guessBomb && !cell.open ? '#5BB' : '#bdbdbd',
          boxShadow: cell.open
            ? 'inset 1px 1px 4px 1px #777'
            : 'inset -1px -1px 4px 1px #333',
          textAlign: 'center',
          width: '2rem',
          height: '2rem',
          display: 'inline-block',
        }}
      >
        {this.renderCell(cell)}
      </td>
    );
  }
}

export default Cell;
