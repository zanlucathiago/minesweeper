import React, { Component } from 'react';
import { Dialog, CircularProgress } from '@material-ui/core';

export class Progress extends Component {
  render() {
    return (
      <div>
        <Dialog
          fullScreen
          open
          PaperProps={{ style: { backgroundColor: '#000' } }}
          style={{ opacity: 0.375 }}
        ></Dialog>
        <CircularProgress
          style={{
            position: 'absolute',
            top: '50%',
            bottom: '50%',
            left: '50%',
            right: '50%',
            zIndex: 1301,
            margin: -20,
          }}
        />
      </div>
    );
  }
}

export default Progress;
