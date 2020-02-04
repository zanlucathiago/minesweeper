import moment from 'moment';
import Actions from '../Actions';
import React, { Component } from 'react';
import {
  Button,
  DialogActions,
  // DialogContentText,
  // DialogContent,
  DialogTitle,
  Dialog,
  DialogContent,
  TableContainer,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
} from '@material-ui/core';

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// const data = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];
export class FeedbackDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  handleClose = () => {
    this.props.handleClose();
  };

  componentDidMount() {
    Actions.getRecords({ level: '5e3764bcd0239c2c672d1834' })
      .then(({ data }) => this.setState({ data }))
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    const { data } = this.state;
    return (
      <Dialog
        disableBackdropClick
        open={true}
        onClose={this.handleClose}
        // aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{this.props.message}</DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText> */}
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Jogador</TableCell>
                  <TableCell align="right">Tempo</TableCell>
                  <TableCell align="right">Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data ? (
                  data.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.player
                          ? row.player.name
                          : 'Jogador não encontrado'}
                      </TableCell>
                      <TableCell align="right">
                        {moment()
                          .minute(0)
                          .second(0)
                          .millisecond(row.performance)
                          .format('mm:ss.SSS')}
                      </TableCell>
                      <TableCell align="right">
                        {moment(row.date).format('DD/MM/YYYY')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <CircularProgress />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={this.handleClose} color="primary">
            Disagree
          </Button> */}
          <Button
            onClick={Actions.addRecord}
            color="primary"
            autoFocus
            variant="contained"
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default FeedbackDialog;
