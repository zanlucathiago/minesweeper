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
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ChartIcon from '@material-ui/icons/BarChart';
import ListIcon from '@material-ui/icons/FormatListNumbered';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
// import LibraryBooks from '@material-ui/icons/LibraryBooks';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
// import Actions from '../Actions';
import Board from '../Board.json';
import LocalStorage from '../LocalStorage';

class Toolbar extends Component {
  menuId = 'primary-search-account-menu';

  constructor(props) {
    super(props);
    // const { name } = props;
    this.state = {
      drawerOpen: false,
      // name,
    };
  }

  // componentDidMount() {
  //   const { name } = this.state;
  //   const { _id } = this.props;
  //   if (!name) {
  //     Actions.getPlayer({ _id }).then(({ data }) =>
  //       this.setState({ name: data.name }),
  //     );
  //   }
  // }

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
    // this.handleMobileMenuClose();
  };

  // handleMobileMenuClose = () => {
  //   this.setState({ mobileMoreAnchorEl: null });
  // };

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
        {/* <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem> */}
        <MenuItem disabled>{name}</MenuItem>
        <Divider />
        <MenuItem onClick={this.handleLogout}>Sair</MenuItem>
      </Menu>
    );
  };

  handleLogout = () => {
    const { logout } = this.props;
    LocalStorage.setPlayer(null);
    this.handleMenuClose();
    logout();
  };

  render() {
    const { drawerOpen } = this.state;
    const { openFeedback, openForm, openSettings } = this.props;
    return (
      <AppBar position="static">
        <SwipeableDrawer
          open={drawerOpen}
          // onClose={() => {}}
          onOpen={() => {}}
          onClose={this.closeDrawer}
        >
          <div
            // className={classes.list}
            role="presentation"
            style={{ width: 199 }}
            // onClick={toggleDrawer(side, false)}
            // onKeyDown={toggleDrawer(side, false)}
          >
            <List>
              {[
                {
                  label: 'Nível',
                  icon: <ChartIcon />,
                  onClick: () => this.onSelectItem(openSettings),
                },
                {
                  label: 'Recordes',
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
                // {
                //   label: 'Como jogar?',
                //   icon: <LibraryBooks />,
                //   onClick: openDocs,
                // },
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
          <IconButton
            edge="start"
            // className={classes.menuButton}
            color="inherit"
            // aria-label="menu"
            onClick={this.openDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography style={{ flexGrow: 1 }} variant="h6">
            {/* {name} */}
            Nível {Board[LocalStorage.getLevel()].name}
          </Typography>
          {/* {auth && ( */}
          <div>
            <IconButton
              // aria-label="account of current user"
              // aria-controls="menu-appbar"
              // aria-haspopup="true"
              // onClick={handleMenu}
              aria-controls={this.menuId}
              aria-haspopup="true"
              onClick={this.handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            {/* <Menu
              id="menu-appbar"
              // anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              // open={open}
              // onClose={handleClose}
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>My account</MenuItem>
            </Menu> */}
          </div>
          {/* )} */}
        </MaterialToolbar>
        {this.renderMenu()}
      </AppBar>
    );
  }
}

Toolbar.defaultProps = {
  name: '',
  // _id: '',
};

Toolbar.propTypes = {
  logout: PropTypes.func.isRequired,
  name: PropTypes.string,
  // _id: PropTypes.string,
  // openDocs: PropTypes.func.isRequired,
  openFeedback: PropTypes.func.isRequired,
  openForm: PropTypes.func.isRequired,
  openSettings: PropTypes.func.isRequired,
};

export default Toolbar;
