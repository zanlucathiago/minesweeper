import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cell from './Cell';
import helper from '../helper';

class BoardGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: props.grid,
    };
  }

  render() {
    const { grid } = this.state;
    const { loseGame, running, winGame } = this.props;

    return (
      <tbody>
        {grid.map((row, idRow) => (
          <tr key={idRow.toString()}>
            {row.map((cell, idCell) => (
              <Cell
                cell={cell}
                key={`${idCell.toString()}${idRow.toString()}${running}`}
                loseGame={loseGame}
                openAround={() => {
                  helper.iterateAround(idRow, idCell, (curRow, curColumn) => {
                    // Apenas setar como open. Isso vai ativar os gatilhos no componentWillReceiveProps de cada celula
                    grid[curRow][curColumn].open = true;
                  });

                  this.setState({ grid });
                }}
                refreshBoard={() => this.setState({ grid })}
                running={running}
                updateWilds={() =>
                  helper.iterateAround(idRow, idCell, (curRow, curColumn) => {
                    // Atualizando dados para solicitações de ajuda
                    grid[curRow][curColumn].isWild = false;
                  })
                }
                winGame={winGame}
              />
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

BoardGrid.propTypes = {
  grid: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())).isRequired,
  loseGame: PropTypes.func.isRequired,
  running: PropTypes.bool.isRequired,
  winGame: PropTypes.func.isRequired,
};

export default BoardGrid;
