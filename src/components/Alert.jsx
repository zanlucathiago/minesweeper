import { Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MaterialAlert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles({
  // root: {
  // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  // borderRadius: 3,
  // border: 0,
  // color: 'white',
  // height: 48,
  // padding: '0 30px',
  // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  // },
  // label: {
  // textTransform: 'capitalize',
  // },
  icon: {
    margin: 'auto',
    marginRight: 12,
  },
});

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
      classes={{
        icon: useStyles().icon,
        // icon: {
        // },
      }}
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
