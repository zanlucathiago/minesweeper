import { Snackbar } from '@material-ui/core';
import MaterialAlert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import React from 'react';

const Alert = ({
  autoHideDuration,
  children,
  icon,
  onClose,
  severity,
  vertical,
}) => (
  <Snackbar
    open
    anchorOrigin={{ vertical, horizontal: 'center' }}
    autoHideDuration={autoHideDuration}
    onClose={onClose}
  >
    <MaterialAlert
      elevation={6}
      icon={icon === false ? false : undefined}
      onClose={onClose}
      severity={severity}
      variant="filled"
    >
      {children}
    </MaterialAlert>
  </Snackbar>
);

Alert.defaultProps = {
  autoHideDuration: 3000,
  children: null,
  icon: null,
  vertical: 'bottom',
};

Alert.propTypes = {
  autoHideDuration: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  icon: PropTypes.element,
  onClose: PropTypes.func.isRequired,
  severity: PropTypes.string.isRequired,
  vertical: PropTypes.string,
};

export default Alert;
