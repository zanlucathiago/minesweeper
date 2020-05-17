import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class SetupDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: props.size,
    };
  }

  handleClose = () => {
    const { handleClose } = this.props;
    handleClose();
  };

  render() {
    const { size } = this.state;
    const { setChanges } = this.props;
    return (
      <Dialog open onClose={this.handleClose}>
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
              setChanges(size);
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

SetupDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  setChanges: PropTypes.func.isRequired,
  size: PropTypes.string.isRequired,
};

export default SetupDialog;