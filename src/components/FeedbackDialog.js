import React, { Component } from 'react';
import {
  Button,
  DialogActions,
  // DialogContentText,
  // DialogContent,
  DialogTitle,
  Dialog,
} from '@material-ui/core';

export class FeedbackDialog extends Component {
  handleClose = () => {
    this.props.handleClose();
  };

  render() {
    return (
      <Dialog
        open={true}
        onClose={this.handleClose}
        // aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{this.props.message}</DialogTitle>
        {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent> */}
        <DialogActions>
          {/* <Button onClick={this.handleClose} color="primary">
            Disagree
          </Button> */}
          <Button
            onClick={this.handleClose}
            color="primary"
            autoFocus
            variant="contained"
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default FeedbackDialog;
