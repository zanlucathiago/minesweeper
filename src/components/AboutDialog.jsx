import React from 'react';
import PropTypes from 'prop-types';
import {
  Slide,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import { version } from '../../package.json';

const logo = require(`../unnamed(8).png`);
const Transition = React.forwardRef(function Transition({
  in: propIn,
  timeout,
  children,
}) {
  return (
    <Slide direction="up" in={propIn} timeout={timeout}>
      {children}
    </Slide>
  );
});

const AboutDialog = ({ handleClose }) => {
  return (
    <Dialog
      open
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
    >
      <DialogContent>
        <img alt="Virtuala" src={logo} width="208px" />
        <DialogContentText>Campo Minado Online</DialogContentText>
        <DialogContentText>por ®Virtuala</DialogContentText>
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
