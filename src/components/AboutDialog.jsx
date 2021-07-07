import React from 'react';
import PropTypes from 'prop-types';

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';

import { version } from '../../package.json';

const logo = require(`../images/vl.png`);

const AboutDialog = ({ handleClose }) => {
  return (
    <Dialog open keepMounted onClose={handleClose}>
      <DialogContent>
        <img alt="Virtuala" src={logo} width="208px" />
        <DialogContentText>Campo Minado Online</DialogContentText>
        <DialogContentText>por Virtualab</DialogContentText>
        <DialogContentText>Versão {version}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose} variant="contained">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AboutDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default AboutDialog;
