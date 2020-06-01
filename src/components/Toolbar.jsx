import {
  AppBar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar as MaterialToolbar,
  Typography,
  Menu,
  MenuItem,
  Avatar,
} from '@material-ui/core';

import ChartIcon from '@material-ui/icons/BarChart';
import ListIcon from '@material-ui/icons/FormatListNumbered';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import InfoIcon from '@material-ui/icons/Info';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Board from '../Board.json';
import LocalStorage from '../LocalStorage';
import ConnectedDisplay from './ConnectedDisplay';

class Toolbar extends Component {
  menuId = 'primary-search-account-menu';

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
    };
  }

  onSelectItem = (callback) => {
    this.closeDrawer();
    callback();
  };

  openDrawer = () => this.setState({ drawerOpen: true });

  closeDrawer = () => this.setState({ drawerOpen: false });

  handleProfileMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  renderMenu = () => {
    const { anchorEl } = this.state;
    const { name } = this.props;

    return (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        id={this.menuId}
        getContentAnchorEl={null}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorEl)}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.openUser}>{name}</MenuItem>
        <Divider />
        <MenuItem onClick={this.handleLogout}>Sair</MenuItem>
      </Menu>
    );
  };

  openUser = () => {
    const { openUser } = this.props;
    this.handleMenuClose();
    openUser();
  };

  handleLogout = () => {
    const { logout } = this.props;
    LocalStorage.setPlayer(null);
    this.handleMenuClose();
    logout();
  };

  render() {
    const { drawerOpen } = this.state;

    const {
      fileURL,
      openFeedback,
      openForm,
      openSettings,
      openAbout,
    } = this.props;

    return (
      <AppBar position="static">
        <SwipeableDrawer
          open={drawerOpen}
          onOpen={() => {}}
          onClose={this.closeDrawer}
        >
          <div role="presentation" style={{ width: 199 }}>
            <List>
              {[
                {
                  label: 'Estágios',
                  icon: <ChartIcon />,
                  onClick: () => this.onSelectItem(openSettings),
                },
                {
                  label: 'Resultados',
                  icon: <ListIcon />,
                  onClick: () => this.onSelectItem(openFeedback),
                },
              ].map((text) => (
                <ListItem button key={text.label} onClick={text.onClick}>
                  <ListItemIcon>{text.icon}</ListItemIcon>
                  <ListItemText primary={text.label} />
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {[
                { label: 'Contato', icon: <MailIcon />, onClick: openForm },
                { label: 'Sobre', icon: <InfoIcon />, onClick: openAbout },
              ].map((text) => (
                <ListItem
                  button
                  key={text.label}
                  onClick={() => this.onSelectItem(text.onClick)}
                >
                  <ListItemIcon>{text.icon}</ListItemIcon>
                  <ListItemText primary={text.label} />
                </ListItem>
              ))}
            </List>
          </div>
        </SwipeableDrawer>
        <MaterialToolbar>
          <IconButton edge="start" color="inherit" onClick={this.openDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            Nível {Board[LocalStorage.getLevel()].name}
          </Typography>
          <ConnectedDisplay />
          <div style={{ position: 'absolute', right: 0 }}>
            <IconButton
              aria-controls={this.menuId}
              aria-haspopup="true"
              onClick={this.handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar src={fileURL} />
            </IconButton>
          </div>
        </MaterialToolbar>
        {this.renderMenu()}
      </AppBar>
    );
  }
}

Toolbar.defaultProps = {
  fileURL: '',
  name: '',
};

Toolbar.propTypes = {
  fileURL: PropTypes.string,
  logout: PropTypes.func.isRequired,
  name: PropTypes.string,
  openAbout: PropTypes.func.isRequired,
  openFeedback: PropTypes.func.isRequired,
  openForm: PropTypes.func.isRequired,
  openSettings: PropTypes.func.isRequired,
  openUser: PropTypes.func.isRequired,
};

export default Toolbar;
