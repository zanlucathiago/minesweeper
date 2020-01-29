import { FaBomb } from 'react-icons/fa';
import { IoIosFlag } from 'react-icons/io';
import React from 'react';
import './App.css';

const colors = ['#000', '#3b71ff', '#417c03', '#ed4f1d', '#193680'];
const bombs = 5;
const rows = 11;
const columns = 16;

const generateGrid = () => {
  const grid = Array(rows)
    .fill()
    .map(() =>
      Array(columns)
        .fill()
        .map(() => ({
          bomb: false,
          flag: false,
          number: 0,
          open: false
        }))
    );
  Array(bombs)
    .fill()
    .forEach(() => {
      let i;
      let j;
      do {
        const index = Math.floor(Math.random() * rows * columns);
        i = Math.floor(index / rows);
        j = index % columns;
      } while (grid[i][j].bomb);
      iterateAround(i, j, (row, column) => {
        grid[row][column].number += 1;
      });
      grid[i][j].bomb = true;
    });
  return grid;
};

const iterateAround = (i, j, callback) => {
  for (let row = Math.max(0, i - 1); row <= Math.min(rows - 1, i + 1); row++) {
    for (
      let column = Math.max(0, j - 1);
      column <= Math.min(columns - 1, j + 1);
      column++
    ) {
      callback(row, column);
    }
  }
};

export default class App extends React.Component {
  squaresOpened = 0;
  constructor(props) {
    super(props);
    this.state = {
      grid: generateGrid()
    };
  }

  componentDidUpdate() {
    if (this.status) {
      alert(this.status);
      this.status = null;
      this.setState({ grid: generateGrid() });
    }
  }

  recursiveOpener = (row, column, grid) => {
    // const { grid } = this.state;
    const currCell = grid[row][column];
    if (!currCell.open && !currCell.flag) {
      if (currCell.bomb) {
        this.status = 'Você perdeu. Clique para recomeçar.';
      }
      currCell.open = true;
      // this.setState({ squaresOpened: })
      console.log(this.squaresOpened);
      this.squaresOpened++;
      if (this.squaresOpened === rows * columns - bombs) {
        this.status = 'Você venceu! Clique para recomeçar.';
      }
      if (!currCell.number) {
        iterateAround(row, column, (curRow, curColumn) => {
          this.recursiveOpener(curRow, curColumn, grid);
        });
      }
    }
  };

  render() {
    const { grid } = this.state;
    return (
      // <div style={{ alignItems: 'center', flexDirection: 'row' }}>
      <div style={{ marginTop: '2rem' }}>
        <table style={{ borderCollapse: 'collapse', margin: 'auto' }}>
          <tbody>
            {grid.map((row, idRow) => (
              <tr>
                {row.map((cell, idCell) => (
                  <td
                    onClick={() => {
                      this.recursiveOpener(idRow, idCell, grid);
                      this.setState({ grid });
                    }}
                    onContextMenu={e => {
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
                      display: 'inline-block'
                    }}
                  >
                    {cell.open ? (
                      cell.bomb ? (
                        <FaBomb size={22} style={{ margin: '0.25rem 0 0 0' }} />
                      ) : (
                        <div
                          style={{
                            color: colors[cell.number],
                            fontSize: '1.41rem',
                            marginTop: '0.125rem'
                          }}
                        >
                          <b>{cell.number || ''}</b>
                        </div>
                      )
                    ) : (
                      cell.flag && (
                        <IoIosFlag
                          // style={{ color: 'red' }}
                          size={22}
                          style={{ color: 'red', margin: '0.25rem 0 0 0' }}
                        />
                      )
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      // </div>
    );
  }
}
