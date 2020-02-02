import React, { Component } from 'react';
import { TextField } from '@material-ui/core';
import moment from 'moment';

export class Stopwatch extends Component {
  startWatch() {
    this.startTime = performance.now();
    this.runClock = setInterval(this.displayTime, 1000);
    this.setState({ running: true });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.running && !this.state.running) {
      this.startWatch();
    } else if (this.state.running && !nextProps.running) {
      this.stopWatch();
    }
  }

  // componentDidMount() {
  // this.startWatch();
  // this.displayTime();
  // }
  constructor(props) {
    super(props);
    this.state = {
      running: false,
      time: this.formatTime(0),
    };
  }
  counter = 0;
  displayTime = () => {
    this.counter++;
    this.setState({
      time: this.formatTime(this.counter),
    });
  };

  formatTime = (seconds) =>
    moment()
      .hour(0)
      .minute(0)
      .second(seconds)
      .format('HH : mm : ss');

  stopWatch() {
    this.endTime = performance.now();
    this.counter = 0;
    clearInterval(this.runClock);
    this.setState({ running: false, time: this.formatTime(0) });
    this.props.openFeedback(this.endTime - this.startTime);
    // alert(
    //   `${this.startTime} - ${this.endTime} - ${this.endTime - this.startTime}`,
    // );
  }

  render() {
    return (
      <TextField
        disabled
        // id="outlined-disabled"
        label="Tempo"
        style={{ width: 108 }}
        value={this.state.time}
        variant="outlined"
      />
    );
  }
}

export default Stopwatch;
