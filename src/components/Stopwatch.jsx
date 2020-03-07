import { TextField } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';
// import React, { Component, useContext } from 'react';
import React, { Component } from 'react';
// import { GlobalContext } from '../context/GlobalState';

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
    this.counter = this.counter + 1000;
    this.setState({
      time: this.formatTime(this.counter),
    });
  };

  formatTime = (milliseconds) =>
    moment()
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(milliseconds)
      .format('mm:ss.SSS');

  startWatch() {
    this.startTime = performance.now();
    this.runClock = setInterval(this.displayTime, 1000);
    this.setState({ running: true, time: this.formatTime(0) });
  }

  stopWatch() {
    const { saveRecord } = this.props;
    this.endTime = performance.now();
    this.counter = 0;
    clearInterval(this.runClock);
    const currPerformance = this.endTime - this.startTime;
    this.setState({ running: false, time: this.formatTime(currPerformance) });
    // this.props.openFeedback(this.endTime - this.startTime);
    saveRecord(currPerformance);
  }

  render() {
    const { time } = this.state;
    return (
      <TextField
        inputProps={{ min: 0, style: { textAlign: 'center' } }}
        disabled
        label="Tempo"
        size="small"
        style={{ width: 100 }}
        value={time}
        variant="outlined"
      />
    );
  }
}

// function Stopwatch(props) {
//   // const appContext = useContext(AppContext);
//   const { currentBombsRemaining } = useContext(GlobalContext);
//   return (
//     <ComponentImpl currentBombsRemaining={currentBombsRemaining} {...props} />
//   );
// }
Stopwatch.defaultProps = {
  running: false,
  saveRecord: () => {},
  // value: 0,
};

Stopwatch.propTypes = {
  running: PropTypes.bool,
  saveRecord: PropTypes.func,
  // value: PropTypes.number,
};
export default Stopwatch;
