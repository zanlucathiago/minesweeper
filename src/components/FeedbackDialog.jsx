import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  // Divider,
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
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import moment from 'moment';
import 'moment/locale/pt-br';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FaGlobeAmericas, FaQuestionCircle } from 'react-icons/fa';
import Actions from '../Actions';
import LocalStorage from '../LocalStorage';
import Alert from './Alert';
import Progress from './Progress';

moment.locale('pt-br');

class FeedbackDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formats: LocalStorage.getFormats(),
      data: [],
      loading: true,
    };
  }

  componentDidMount() {
    const { formats } = this.state;
    this.fetchRecords(formats);
  }

  handleFormat = (e, newFormats) => {
    this.fetchRecords(newFormats);
    LocalStorage.setFormats(newFormats);
    this.setState({ formats: newFormats, loading: true });
  };

  fetchRecords = (newFormats) => {
    Actions.getRecords(newFormats)
      .then(({ data }) => this.setState({ data, loading: false }))
      .catch(({ response }) =>
        this.setState({
          alert: response ? response.data : 'Estamos com problemas no servidor',
          loading: false,
        }),
      );
  };

  handleClose = () => {
    const { handleClose } = this.props;
    handleClose();
  };

  render() {
    const { alert, alertInfo, data, formats, loading } = this.state;
    const { content } = this.props;
    return (
      <Dialog open onClose={this.handleClose}>
        {alert && (
          <Alert
            onClose={() => this.setState({ alert: null })}
            severity="error"
          >
            {alert}
          </Alert>
        )}
        {alertInfo && (
          <Alert
            autoHideDuration={9000}
            icon={false}
            onClose={() => this.setState({ alertInfo: null })}
            severity="info"
          >
            {alertInfo}
          </Alert>
        )}
        {loading && <Progress />}
        <DialogTitle>
          Ranking {formats[0] !== 'player' ? 'Pessoal' : 'Global'}
        </DialogTitle>
        <DialogContent>
          {content && <DialogContentText>{content}</DialogContentText>}
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
              {/* <ToggleButton style={{ height: 32 }} value="date">
                <FaInfinity />
              </ToggleButton> */}
            </ToggleButtonGroup>
            <IconButton
              onClick={() =>
                this.setState({
                  alertInfo: (
                    <Grid container>
                      {/* <Grid
                        item
                        xs={2}
                        style={{ margin: 'auto', textAlign: 'center' }}
                      >
                        <FaGlobeAmericas />
                      </Grid> */}
                      {/* <Grid item xs={10}> */}
                      <Grid item>
                        <Typography>
                          Ranking dinâmico com performances relevantes.
                        </Typography>
                      </Grid>
                      {/* <Grid item xs={12}>
                        <Divider
                          style={{ backgroundColor: '#FFF', margin: 8 }}
                          variant="middle"
                        />
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        style={{ margin: 'auto', textAlign: 'center' }}
                      >
                        <FaInfinity />
                      </Grid>
                      <Grid item xs={10}>
                        <Typography>
                          Escolher entre listar recordes do último dia ou de
                          todos os dias.
                        </Typography>
                      </Grid> */}
                    </Grid>
                  ),
                })
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
                {data.map((row, index) => (
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
                      {/* {moment(row.date).format('DD/MM/YYYY HH:mm')} */}
                      {moment(row.date).calendar()}
                      {/* {moment(row.date).format('LLLL')} */}
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
  title: '',
};

FeedbackDialog.propTypes = {
  content: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default FeedbackDialog;
