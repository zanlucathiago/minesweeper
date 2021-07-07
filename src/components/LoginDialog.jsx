import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';

import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Actions from '../Actions';
import DialPad from './DialPad';
import Progress from './Progress';

class LoginDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkPIN: false,
      createPIN: false,
      loading: false,
      player: '',
      creating: false,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  addPlayer = () => {
    const { alertError, alertWarning } = this.props;
    const { player } = this.state;

    if (player) {
      Actions.getPlayer({ slug: _.kebabCase(player) })
        .then(() => {
          alertError('Já existe um usuario com este nome!');

          this.setState({
            loading: false,
          });
        })
        .catch((error) => {
          if (error.response.status === 404) {
            this.setState({ createPIN: true, loading: false });
          } else {
            alertError(error.response.data);
            this.setState({ loading: false });
          }
        });
      this.setState({ loading: true });
    } else {
      alertWarning('Insira um nome!');
    }

    this.setState({ creating: true });
  };

  changePlayer = ({ target }) => {
    this.setState({ player: target.value });
  };

  getPlayer = () => {
    const { alertError, alertWarning } = this.props;
    const { player } = this.state;

    if (player) {
      Actions.getPlayer({ slug: _.kebabCase(player) })
        .then(({ data }) => {
          this.setState({
            name: data.name,
            PIN: data.pin.split('').map((item) => parseInt(item, 10)),
            loading: false,
            checkPIN: true,
            _id: data._id,
          });
        })
        .catch((error) => {
          alertError(
            error.response
              ? error.response.data
              : error.message || 'Estamos com problemas no servidor',
          );

          this.setState({
            loading: false,
          });
        });
      this.setState({ loading: true });
    } else {
      alertWarning('Insira um nome!');
    }
  };

  onKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.getPlayer();
    }
  };

  checkPIN = (value) => {
    const { alertError, alertSuccess, alertWarning } = this.props;
    const { _id, creating, name, player, PIN } = this.state;

    if (creating) {
      if (value.every((item, index) => item === PIN[index])) {
        Actions.addPlayer({
          name: player,
          pin: PIN.join(''),
        })
          .then(() => {
            alertSuccess('Jogador criado! Entre para jogar.');

            this.setState({
              loading: false,
              checkPIN: false,
            });
          })
          .catch((error) => {
            alertError(
              error.response
                ? error.response.data
                : error.message || 'Estamos com problemas no servidor.',
            );

            this.setState({
              loading: false,
              checkPIN: false,
            });
          });
        this.setState({ loading: true });
      } else {
        alertWarning('As chaves não coincidem!');
        this.setState({ checkPIN: false });
      }
    } else if (value.every((item, index) => item === PIN[index])) {
      const { onStart } = this.props;
      onStart(_id, name);
    } else {
      alertWarning('Chave inválida!');
      this.setState({ checkPIN: false });
    }
  };

  render() {
    const { checkPIN, createPIN, creating, loading, player } = this.state;
    const { handleClose } = this.props;

    return (
      <div>
        {loading && <Progress />}
        {createPIN && (
          <DialPad
            onClose={() => this.setState({ createPIN: false })}
            title="Crie uma chave"
            content="4 dígitos"
            onFinish={(PIN) =>
              this.setState({ PIN, createPIN: false, checkPIN: true })
            }
          />
        )}
        {checkPIN && (
          <DialPad
            onClose={() => this.setState({ checkPIN: false })}
            title={creating ? 'Confirme a chave' : 'Insira sua chave'}
            onFinish={this.checkPIN}
          />
        )}
        <Dialog open onClose={handleClose}>
          <DialogTitle id="form-dialog-title">Entrar</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Jogador"
              fullWidth
              onChange={this.changePlayer}
              size="small"
              value={player}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.addPlayer} color="primary" variant="outlined">
              Cadastrar
            </Button>
            <Button
              onClick={() => {
                this.setState({ creating: false });
                this.getPlayer();
              }}
              color="primary"
              ref={(ref) => {
                this.confirm = ref;
              }}
              variant="contained"
            >
              Entrar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

LoginDialog.propTypes = {
  onStart: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default LoginDialog;
