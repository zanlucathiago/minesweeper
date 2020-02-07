import React, { Component } from 'react';
import {
  Button,
  ButtonGroup,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogContentText,
} from '@material-ui/core';

export class DialPad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [],
      step: 3,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  onKeyDown = (e) => {
    // debugger;
    switch (e.key) {
      case '1':
        this.handleNext(1);
        break;
      case '2':
        this.handleNext(2);
        break;
      case '3':
        this.handleNext(3);
        break;
      case '4':
        this.handleNext(4);
        break;
      case '5':
        this.handleNext(5);
        break;
      case '6':
        this.handleNext(6);
        break;
      case '7':
        this.handleNext(7);
        break;
      case '8':
        this.handleNext(8);
        break;
      case '9':
        this.handleNext(9);
        break;
      case '0':
        this.handleNext(0);
        break;
      default:
        break;
    }
  };

  handleNext = (number) => {
    const { step, value } = this.state;
    const { onFinish } = this.props;
    value.push(number);
    if (!step) {
      onFinish(value);
    } else {
      this.setState({ step: step - 1, value });
    }
  };
  render() {
    const { content, onClose, title } = this.props;
    return (
      <Dialog onClose={onClose} open>
        <DialogTitle style={{ textAlign: 'center' }}>{title}</DialogTitle>
        <DialogContent>
          {content && <DialogContentText>{content}</DialogContentText>}
          <ButtonGroup
            orientation="vertical"
            color="primary"
            style={{ margin: '0.5rem' }}
          >
            <Button onClick={() => this.handleNext(7)}>7</Button>
            <Button onClick={() => this.handleNext(4)}>4</Button>
            <Button onClick={() => this.handleNext(1)}>1</Button>
          </ButtonGroup>
          <ButtonGroup
            orientation="vertical"
            color="primary"
            style={{ margin: '0.5rem' }}
          >
            <Button onClick={() => this.handleNext(8)}>8</Button>
            <Button onClick={() => this.handleNext(5)}>5</Button>
            <Button onClick={() => this.handleNext(2)}>2</Button>
            <Button onClick={() => this.handleNext(0)}>0</Button>
          </ButtonGroup>
          <ButtonGroup
            orientation="vertical"
            color="primary"
            style={{ margin: '0.5rem' }}
          >
            <Button onClick={() => this.handleNext(9)}>9</Button>
            <Button onClick={() => this.handleNext(6)}>6</Button>
            <Button onClick={() => this.handleNext(3)}>3</Button>
          </ButtonGroup>
        </DialogContent>
      </Dialog>
    );
  }
}

export default DialPad;
