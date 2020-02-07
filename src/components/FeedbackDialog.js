import moment from 'moment';
import Actions from '../Actions';
import React, { Component } from 'react';
import {
  Button,
  DialogActions,
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
  DialogContentText,
  Grid,
  IconButton,
  Typography,
  Divider,
} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { FaGlobeAmericas, FaInfinity, FaQuestionCircle } from 'react-icons/fa';
import LocalStorage from '../LocalStorage';
import Progress from './Progress';
import 'moment/locale/pt-br';
import Alert from './Alert';

moment.locale('pt-br');

export class FeedbackDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formats: LocalStorage.getFormats(),
      data: [],
      loading: true,
    };
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
    this.props.handleClose();
  };

  componentDidMount() {
    const { formats } = this.state;
    this.fetchRecords(formats);
  }

  render() {
    const { alert, alertInfo, data, formats, loading } = this.state;
    const { content, title } = this.props;
    return (
      <Dialog open={true} onClose={this.handleClose}>
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
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {content && (
            <DialogContentText id="alert-dialog-description">
              {content}
            </DialogContentText>
          )}
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
              <ToggleButton style={{ height: 32 }} value="date">
                <FaInfinity />
              </ToggleButton>
            </ToggleButtonGroup>
            <IconButton
              onClick={() =>
                this.setState({
                  alertInfo: (
                    <Grid container>
                      <Grid
                        item
                        xs="2"
                        style={{ margin: 'auto', textAlign: 'center' }}
                      >
                        <FaGlobeAmericas />
                      </Grid>
                      <Grid item xs="10">
                        <Typography>
                          Escolher entre listar recordes pessoais ou de todos os
                          jogadores.
                        </Typography>
                      </Grid>
                      <Grid item xs="12">
                        <Divider
                          style={{ backgroundColor: '#FFF', margin: 8 }}
                          variant="middle"
                        />
                      </Grid>
                      <Grid
                        item
                        xs="2"
                        style={{ margin: 'auto', textAlign: 'center' }}
                      >
                        <FaInfinity />
                      </Grid>
                      <Grid item xs="10">
                        <Typography>
                          Escolher entre listar recordes do último dia ou de
                          todos os dias.
                        </Typography>
                      </Grid>
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
                  <TableRow key={row.name}>
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

export default FeedbackDialog;
