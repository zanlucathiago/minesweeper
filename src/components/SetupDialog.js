import React, { Component } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';

export class SetupDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: props.size,
    };
  }
  handleClose = () => {
    this.props.handleClose();
  };
  render() {
    const { size } = this.state;
    return (
      <Dialog
        open={true}
        onClose={this.handleClose}
      >
        <DialogTitle id="form-dialog-title">Configurações</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <FormLabel component="legend">Nível</FormLabel>
            <RadioGroup
              value={size}
              onChange={(e) => this.setState({ size: e.target.value })}
            >
              <FormControlLabel value="sm" control={<Radio />} label="Fácil" />
              <FormControlLabel value="md" control={<Radio />} label="Médio" />
              <FormControlLabel
                value="lg"
                control={<Radio />}
                label="Difícil"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              this.handleClose();
              this.props.setChanges(size);
            }}
            color="primary"
            variant="contained"
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default SetupDialog;
