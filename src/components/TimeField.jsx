import React from 'react';
import { TextField } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';

function TimeField({ label, value }) {
  return (
    <TextField
      inputProps={{ min: 0, style: { textAlign: 'center' } }}
      disabled
      label={label}
      size="small"
      style={{ width: 100 }}
      value={
        value
          ? moment()
              .hour(0)
              .minute(0)
              .second(0)
              .millisecond(value)
              .format('mm:ss.SSS')
          : '--:--:---'
      }
      variant="outlined"
    />
  );
}

TimeField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

export default TimeField;
