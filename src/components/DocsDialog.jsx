import React, { Component } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  // DialogContentText,
  DialogActions,
  Button,
  Typography,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanel,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';

class DocsDialog extends Component {
  render() {
    const { handleClose } = this.props;
    const { expanded } = this.state;
    return (
      <Dialog open onClose={handleClose} scroll="paper">
        <DialogTitle id="scroll-dialog-title">Como Jogar</DialogTitle>
        <DialogContent dividers>
          <ExpansionPanel
            expanded={expanded === 'panel1'}
            // onChange={handleChange('panel1')}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography>General settings</Typography>
              <Typography>I am an expansion panel</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis
                feugiat. Aliquam eget maximus est, id dignissim quam.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            expanded={expanded === 'panel2'}
            // onChange={handleChange('panel2')}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography>Users</Typography>
              <Typography>You are currently not an owner</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Donec placerat, lectus sed mattis semper, neque lectus feugiat
                lectus, varius pulvinar diam eros in elit. Pellentesque
                convallis laoreet laoreet.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            expanded={expanded === 'panel3'}
            // onChange={handleChange('panel3')}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <Typography>Advanced settings</Typography>
              <Typography>
                Filtering has been entirely disabled for whole web server
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl.
                Integer sit amet egestas eros, vitae egestas augue. Duis vel est
                augue.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            expanded={expanded === 'panel4'}
            // onChange={handleChange('panel4')}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              // aria-controls="panel4bh-content"
              // id="panel4bh-header"
            >
              <Typography>Personal data</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl.
                Integer sit amet egestas eros, vitae egestas augue. Duis vel est
                augue.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          {/* <DialogContentText tabIndex={-1}>
        Mecânica do Campo Minado

      </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose} color="primary">
        Cancel
      </Button> */}
          <Button variant="contained" onClick={handleClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

DocsDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default DocsDialog;
