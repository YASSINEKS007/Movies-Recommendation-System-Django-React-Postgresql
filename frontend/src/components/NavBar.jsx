import DarkMode from "@mui/icons-material/DarkMode";
import Favorite from "@mui/icons-material/Favorite";
import LightMode from "@mui/icons-material/LightMode";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PlaylistPlay from "@mui/icons-material/PlaylistPlay";
import Settings from "@mui/icons-material/Settings";

import Search from "@mui/icons-material/Search";
import {
  Divider,
  IconButton,
  InputBase,
  ListItemIcon,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogout, setMode } from "../state";

function NavBar() {
  const isNotMobileScreen = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const alt = theme.palette.background.alt;
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElIcon, setAnchorElIcon] = useState(null);

  const open = Boolean(anchorEl);
  const openIcon = Boolean(anchorElIcon);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mode = useSelector((state) => state.mode);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickIcon = (event) => {
    setAnchorElIcon(event.currentTarget);
  };

  const handleCloseIcon = () => {
    setAnchorElIcon(null);
  };

  const handleModeToggle = () => {
    dispatch(setMode());
    setAnchorElIcon(null);
  };

  return isNotMobileScreen ? (
    <div
      className="flex items-center p-3 justify-between"
      style={{ backgroundColor: `${alt}` }}
    >
      {/* Start - Menu Icon and Menu */}
      <div className="flex items-center">
        <MenuIcon onClick={handleClick} />
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate("/home");
            }}
          >
            Home
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate("/genre");
            }}
          >
            Genre
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              dispatch(setLogout());
              navigate("/login");
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </div>

      {/* Middle - Search Bar */}
      <div
        className="flex items-center rounded-4"
        style={{ backgroundColor: `${neutralLight}`, width: "400px" }}
      >
        <InputBase
          placeholder="Search a movie..."
          className="p-1"
        />
        <div className="flex-grow"></div>{" "}
        {/* This will push the IconButton to the end */}
        <IconButton>
          <Search />
        </IconButton>
      </div>

      {/* End - Account Settings */}
      <div className="flex items-center">
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClickIcon}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorElIcon}
          id="account-menu"
          open={openIcon}
          onClose={handleCloseIcon}
          onClick={handleCloseIcon}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleClose}>
            <Avatar /> Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Favorite fontSize="medium" />
            </ListItemIcon>
            Favorites
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <PlaylistPlay fontSize="medium" />
            </ListItemIcon>
            Watchlist
          </MenuItem>
          {mode === "light" ? (
            <MenuItem onClick={handleModeToggle}>
              <ListItemIcon>
                <DarkMode fontSize="medium" />
              </ListItemIcon>
              Dark mode
            </MenuItem>
          ) : (
            <MenuItem onClick={handleModeToggle}>
              <ListItemIcon>
                <LightMode fontSize="medium" />
              </ListItemIcon>
              Light mode
            </MenuItem>
          )}
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Settings fontSize="medium" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              dispatch(setLogout());
            }}
          >
            <ListItemIcon>
              <Logout fontSize="medium" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </div>
    </div>
  ) : (
    <div
      className="flex items-center p-2"
      style={{ backgroundColor: `${alt}` }}
    >
      <MenuIcon onClick={handleClick} />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            navigate("/home");
          }}
        >
          Home
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            navigate("/genre");
          }}
        >
          Genre
        </MenuItem>
      </Menu>
      <span className="flex-auto"></span>

      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClickIcon}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorElIcon}
        id="account-menu"
        open={openIcon}
        onClose={handleCloseIcon}
        onClick={handleCloseIcon}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Favorite fontSize="medium" />
          </ListItemIcon>
          Favorites
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PlaylistPlay fontSize="medium" />
          </ListItemIcon>
          Watchlist
        </MenuItem>

        {mode === "light" ? (
          <MenuItem onClick={handleModeToggle}>
            <ListItemIcon>
              <DarkMode fontSize="medium" />
            </ListItemIcon>
            Dark mode
          </MenuItem>
        ) : (
          <MenuItem onClick={handleModeToggle}>
            <ListItemIcon>
              <LightMode fontSize="medium" />
            </ListItemIcon>
            Light mode
          </MenuItem>
        )}

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="medium" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            dispatch(setLogout());
          }}
        >
          <ListItemIcon>
            <Logout fontSize="medium" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}

export default NavBar;
