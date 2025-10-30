import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../context/UserContext';
import {
  Typography,
  Box,
  Button,
  MenuItem,
  Menu,
  Avatar,
  AppBar,
  Toolbar,
} from '@mui/material';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import LoginIcon from '@mui/icons-material/Login';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';

export const Navbar = () => {
  const { logout, user } = useContext(UserContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  const handleClick = (e) => {
    setAnchorEl(e.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
  };


  return (
    <>
      <AppBar className="navbar">
        <Toolbar
          sx={{
            maxWidth: 1200,
            margin: '0 auto',
            width: '100%',
            justifyContent: 'space-between',
            paddingX: { xs: 2, sm: 3 },
          }}
        >
          <Box>
            <Typography
              variant="h5"
              component="span"
              sx={{
                fontFamily: 'serif',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'var(--chart-0)',
              }}
              className="clickable-item"
              onClick={() => navigate('/')}
            >
              Wisdom
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <Box
              variant="h6"
              component="span"
              sx={{
                display: 'flex',
                fontFamily: 'serif',
                color: 'var(--muted-foreground)',
                fontStyle: 'oblique',
                fontWeight: 'bold',
                mr: 3,
                '&:hover': {
                  color: 'var(--foreground)',
                  transition: 'color 0.3s ease-in-out',
                },
              }}
              className="clickable-item"
              onClick={() => navigate('/')}
            >
              <AutoStoriesOutlinedIcon
                sx={{
                  mr: 0.5,
                }}
              />
              <Typography>Feed</Typography>
            </Box>
            <Box
              variant="h6"
              component="span"
              sx={{
                display: 'flex',
                fontFamily: 'serif',
                color: 'var(--muted-foreground)',
                fontStyle: 'oblique',
                fontWeight: 'bold',
                '&:hover': {
                  color: 'var(--foreground)',
                  transition: 'color 0.3s ease-in-out',
                },
              }}
              className="clickable-item"
              onClick={() => navigate('/explore')}
            >
              <ExploreOutlinedIcon
                sx={{
                  mr: 0.5,
                }}
              />
              <Typography>Explore</Typography>
            </Box>
          </Box>

          {!user ? (
            <Box>
              <Button
                variant="contained"
                size="medium"
                disabled={user['user']['id']}
              >
                <LoginIcon />
                {user ? 'Connecting...' : 'Log In'}
              </Button>
            </Box>
          ) : (
            <Box sx={{ minWidth: 120 }}>
              <Avatar
                alt="icon"
                sx={{ width: 40, height: 40, color: 'var(--primary)' }}
                className="clickable-item"
                onClick={handleClick}
              >
                <AutoStoriesRoundedIcon />
              </Avatar>
              <Menu
                sx={{ my: 1 }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    navigate('/profile');
                    handleClose();
                  }}
                >
                  <PersonOutlineIcon />
                  My Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon />
                  Log out
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};
