import { TextField } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Stopwatch extends Component {
  counter = 0;

  constructor(props) {
    super(props);
    this.state = {
      running: false,
      time: this.formatTime(0),
    };
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { running } = this.state;
    if (nextProps.running && !running) {
      this.startWatch();
    } else if (running && !nextProps.running) {
      this.stopWatch();
    }
  }

  displayTime = () => {
    this.counter = this.counter + 1;
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

  startWatch() {
    this.startTime = performance.now();
    this.runClock = setInterval(this.displayTime, 1000);
    this.setState({ running: true });
  }

  stopWatch() {
    const { saveRecord } = this.props;
    this.endTime = performance.now();
    this.counter = 0;
    clearInterval(this.runClock);
    this.setState({ running: false, time: this.formatTime(0) });
    // this.props.openFeedback(this.endTime - this.startTime);
    saveRecord(this.endTime - this.startTime);
  }

  render() {
    const { time } = this.state;
    return (
      <TextField
        disabled
        label="Tempo"
        size="small"
        style={{ width: 108 }}
        value={time}
        variant="outlined"
      />
    );
  }
}

Stopwatch.propTypes = {
  running: PropTypes.bool.isRequired,
  saveRecord: PropTypes.func.isRequired,
};

export default Stopwatch;
