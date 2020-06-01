import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';

import { ToggleButton, ToggleButtonGroup, Rating } from '@material-ui/lab';
import moment from 'moment';
import 'moment/locale/pt-br';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FaGlobeAmericas, FaQuestionCircle } from 'react-icons/fa';
import Actions from '../Actions';
import LocalStorage from '../LocalStorage';
import Progress from './Progress';

moment.locale('pt-br');

class FeedbackDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formats: LocalStorage.getFormats(),
      data: [[], []],
      loading: true,
    };
  }

  componentDidMount() {
    const { formats } = this.state;
    this.fetchRecords(formats);
  }

  handleFormat = (e, newFormats) => {
    LocalStorage.setFormats(newFormats);
    this.setState({ formats: newFormats });
  };

  fetchRecords = (newFormats) => {
    const { alertError, updateRecords } = this.props;

    Actions.getRecords(newFormats)
      .then(({ data }) => {
        updateRecords(data[1]);
        this.setState({ data, loading: false });
      })
      .catch(({ response }) => {
        alertError(
          response ? response.data : 'Estamos com problemas no servidor',
        );

        this.setState({
          loading: false,
        });
      });
  };

  handleClose = () => {
    const { handleClose } = this.props;
    handleClose();
  };

  render() {
    const { data, formats, loading } = this.state;
    const { alertInfo, content, rating } = this.props;

    return (
      <Dialog open onClose={this.handleClose}>
        {loading && <Progress />}
        <DialogTitle>
          Ranking {formats[0] !== 'player' ? 'Pessoal' : 'Global'}
        </DialogTitle>
        <DialogContent>
          {content && [
            <DialogContentText key="performance">{content}</DialogContentText>,
            <DialogContentText key="rating">
              <Rating max={rating} name="read-only" value={rating} readOnly />
            </DialogContentText>,
          ]}
          <Grid
            style={{
              marginBottom: 8,
              position: 'relative',
              textAlign: 'center',
            }}
          >
            <ToggleButtonGroup value={formats} onChange={this.handleFormat}>
              <ToggleButton style={{ height: 32 }} value="player">
                <FaGlobeAmericas />
              </ToggleButton>
            </ToggleButtonGroup>
            <IconButton
              onClick={() =>
                alertInfo(
                  <Grid container>
                    <Grid item>
                      <Typography>
                        Ranking dinâmico com performances relevantes.
                      </Typography>
                    </Grid>
                  </Grid>,
                  { autoHideDuration: 9000, icon: false },
                )
              }
              style={{ position: 'absolute', padding: 4, right: 0 }}
            >
              <FaQuestionCircle />
            </IconButton>
          </Grid>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="right">#</TableCell>
                  <TableCell>Jogador</TableCell>
                  <TableCell align="right">Tempo</TableCell>
                  <TableCell align="right">Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data[formats[0] !== 'player' ? 1 : 0].map((row, index) => (
                  <TableRow key={row._id}>
                    <TableCell align="right">{index + 1}</TableCell>
                    <TableCell component="th" scope="row">
                      {row.player && row.player.name}
                    </TableCell>
                    <TableCell align="right">
                      {moment()
                        .minute(0)
                        .second(0)
                        .millisecond(row.performance)
                        .format('mm:ss.SSS')}
                    </TableCell>
                    <TableCell align="right">
                      {moment(row.date).calendar()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
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

FeedbackDialog.defaultProps = {
  content: '',
};

FeedbackDialog.propTypes = {
  content: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
};

export default FeedbackDialog;
