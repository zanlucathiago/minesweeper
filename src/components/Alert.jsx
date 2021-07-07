import { Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MaterialAlert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

const useStyles = makeStyles({
  icon: {
    margin: 'auto',
    marginRight: 12,
  },
});

const Alert = ({ autoHideDuration, children, icon, severity, vertical }) => {
  const { hideAlert } = useContext(GlobalContext);

  return (
    <Snackbar
      open
      anchorOrigin={{ vertical, horizontal: 'center' }}
      autoHideDuration={autoHideDuration}
      onClose={hideAlert}
    >
      <MaterialAlert
        classes={{
          icon: useStyles().icon,
        }}
        elevation={6}
        icon={icon === false ? false : undefined}
        onClose={hideAlert}
        severity={severity}
        variant="filled"
      >
        {children}
      </MaterialAlert>
    </Snackbar>
  );
};

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
  severity: PropTypes.string.isRequired,
  vertical: PropTypes.string,
};

export default Alert;
