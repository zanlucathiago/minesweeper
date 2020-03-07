import imageCompression from 'browser-image-compression';
import React from 'react';
import {
  // Slide,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Actions from '../Actions';
import Alert from './Alert';
import Progress from './Progress';

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

class UserDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      urlFile: props.fileURL,
    };
  }

  UNSAFE_componentWillReceiveProps({ fileURL }) {
    if (fileURL) {
      this.setState({ urlFile: fileURL });
    }
  }

  handleClose = () => {
    const { handleClose } = this.props;
    handleClose();
  };

  handleSave = () => {
    const { file, urlFile } = this.state;
    const { handleSave } = this.props;
    const { _id } = this.props;
    this.setState({ loading: true });

    const data = new FormData();
    data.append('file', file);
    // data.append('file', file);
    Actions.updatePlayer(data, _id)
      .then(() => handleSave(urlFile))
      .catch(({ response }) =>
        this.setState({
          loading: false,
          alert: response ? response.data : 'Estamos com problemas no servidor',
        }),
      );
  };

  changeImage = async ({ target }) => {
    let [file] = target.files;
    file = await this.handleImageUpload(file);
    this.setState({ file, urlFile: URL.createObjectURL(file), loading: false });
  };

  handleImageUpload = async (imageFile) => {
    try {
      return await imageCompression(imageFile, {
        // maxIteration: 32,
        maxIteration: 8,
        // maxSizeMB: 0.0078125,
        maxSizeMB: 0.03125,
        useWebWorker: true,
      });
    } catch (error) {
      console.log(error);
    }

    return null;
  };

  render() {
    const { name } = this.props;
    const { alert, urlFile, loading } = this.state;
    return (
      <Dialog
        open
        // TransitionComponent={Transition}
        keepMounted
        onClose={this.handleClose}
      >
        {alert && (
          <Alert
            onClose={() => {
              this.setState({ alert: null });
            }}
            severity="error"
          >
            {alert}
          </Alert>
        )}
        {loading && <Progress />}
        <DialogContent>
          <label htmlFor="icon-button-file">
            <Avatar
              alt={name}
              src={urlFile}
              style={{ height: 160, margin: 'auto', width: 160 }}
            />
            <input
              accept="image/*"
              id="icon-button-file"
              onChange={(e) => {
                this.changeImage(e);
                this.setState({ loading: true });
              }}
              style={{ display: 'none' }}
              type="file"
            />
          </label>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.handleClose} variant="outlined">
            Fechar
          </Button>
          <Button color="primary" onClick={this.handleSave} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

UserDialog.propTypes = {
  _id: PropTypes.number.isRequired,
  handleSave: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default UserDialog;
