import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Actions from '../Actions';
import Progress from './Progress';

const numbers = Array(10)
  .fill('')
  .map((item, index) => index.toString());

class FormDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
    };
  }

  handleClose = () => {
    const { handleClose } = this.props;
    handleClose();
  };

  changePhone = (e) => {
    const { value } = e.target;
    const numbered = value.split('').filter((o) => numbers.includes(o));
    const limited = numbered.filter((o, index) => index < 11);
    const { length } = limited;

    if (length) {
      if (length > 2) {
        if (length === 11) {
          limited.splice(7, 0, '-');
        } else if (length > 6) {
          limited.splice(6, 0, '-');
        }

        limited.splice(2, 0, ') ');
      }

      limited.splice(0, 0, '(');
    }

    this.setState({ phone: limited.join('') });
  };

  changeName = ({ target }) => this.setState({ name: target.value });

  changeEmail = ({ target }) => this.setState({ email: target.value });

  changeMessage = ({ target }) => this.setState({ message: target.value });

  sendMail = () => {
    const { name, email, phone, message } = this.state;
    this.setState({ loading: true });
    Actions.sendMail({ name, email, phone, message })
      .then(this.finish)
      .catch();
  };

  finish = ({ data }) => {
    const { handleClose } = this.props;
    handleClose(data);
  };

  render() {
    const { loading, name, message, email, phone } = this.state;
    return (
      <Dialog open onClose={this.handleClose}>
        {loading && <Progress />}
        <DialogTitle>Mensagem</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Envie sugestões, dúvidas, reclamações etc.
          </DialogContentText>
          <TextField
            label="Nome"
            onChange={this.changeName}
            size="small"
            style={{ margin: 8 }}
            value={name}
            variant="outlined"
          />
          <TextField
            label="E-mail"
            onChange={this.changeEmail}
            size="small"
            style={{ margin: 8 }}
            value={email}
            variant="outlined"
          />
          <TextField
            label="Telefone"
            onChange={this.changePhone}
            size="small"
            style={{ margin: 8 }}
            value={phone}
            variant="outlined"
          />
          <TextField
            label="Mensagem"
            multiline
            onChange={this.changeMessage}
            rows={4}
            size="small"
            style={{ margin: 8 }}
            value={message}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" variant="outlined">
            Cancelar
          </Button>
          <Button onClick={this.sendMail} color="primary" variant="contained">
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

FormDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default FormDialog;
