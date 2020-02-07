import React, { Component } from 'react';
import MaterialAlert from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';

class Alert extends Component {
  render() {
    const {
      autoHideDuration,
      children,
      icon,
      onClose,
      severity,
      vertical,
    } = this.props;
    return (
      <Snackbar
        open={true}
        anchorOrigin={{ vertical: vertical || 'bottom', horizontal: 'center' }}
        autoHideDuration={autoHideDuration || 3000}
        onClose={onClose}
      >
        <MaterialAlert
          elevation={6}
          {...(icon === false ? { icon: false } : {})}
          onClose={onClose}
          severity={severity}
          variant="filled"
        >
          {children}
        </MaterialAlert>
      </Snackbar>
    );
  }
}

export default Alert;
