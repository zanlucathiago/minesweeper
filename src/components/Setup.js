import React, { Component } from 'react';
import { Slider, Typography, Button, Grid } from '@material-ui/core';

export class Setup extends Component {
  constructor(props) {
    super(props);
    this.rows = props.rows;
    this.columns = props.columns;
    this.bombs = props.bombs;
  }
  setRows = (e, value) => (this.rows = value);
  setColumns = (e, value) => (this.columns = value);
  setBombs = (e, value) => (this.bombs = value);
  onConfirm = () => {
    const { onChange } = this.props;
    onChange(this.rows, this.columns, this.bombs);
  };
  render() {
    // const { onChangeBombs, onChangeColumn, onChangeRow } = this.props;
    return (
      // <div>
      <Grid container spacing={3}>
        <Grid container item xs={12} sm={6}>
          {/* <div style={{ margin: 'auto', width: 300 }}> */}
          <Grid item xs={12}>
            <Typography id="discrete-slider" gutterBottom>
              Linhas
            </Typography>
            <Slider
              defaultValue={this.rows}
              onChange={this.setRows}
              // getAriaValueText={valuetext}
              // aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={6}
              max={22}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography id="discrete-slider" gutterBottom>
              Colunas
            </Typography>
            <Slider
              defaultValue={this.columns}
              // getAriaValueText={valuetext}
              // aria-labelledby="discrete-slider"
              onChange={this.setColumns}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={6}
              max={42}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography id="discrete-slider" gutterBottom>
              Bombas
            </Typography>
            <Slider
              defaultValue={this.bombs}
              // getAriaValueText={valuetext}
              // aria-labelledby="discrete-slider"
              onChange={this.setBombs}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={8}
              max={140}
            />
          </Grid>
          {/* </div> */}
        </Grid>
        <Grid
          item
          style={{ margin: 'auto', textAlign: 'center' }}
          xs={12}
          sm={6}
        >
          <Button onClick={this.onConfirm} variant="contained">
            Confirmar
          </Button>
        </Grid>
      </Grid>
      // </div>
    );
  }
}

export default Setup;
