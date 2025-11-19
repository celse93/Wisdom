import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../context/UserContext';
import { LoginForm } from '../pages/LoginForm';
import {
  Typography,
  Box,
  Button,
  MenuItem,
  Menu,
  Avatar,
  AppBar,
  Toolbar,
  Modal,
} from '@mui/material';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import LoginIcon from '@mui/icons-material/Login';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';

export const Navbar = () => {
  const { logout, profile, isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const isOpen = Boolean(anchorEl);

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClick = (e) => {
    setAnchorEl(e.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
  };

  const handleClickProfile = () => {
    navigate(`/profile/${profile.id}`);
    handleClose();
  };

  const getProfileAvatar = () => {
    const userName = profile?.username || 'user';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=d58d63&color=f4ede8&size=100&bold=true&rounded=true`;
  };

  return (
    <>
      <AppBar className="navbar">
        <Toolbar
          sx={{
            margin: '0 auto',
            width: '100%',
            justifyContent: 'space-between',
            paddingX: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ml: 5}}>
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
          {!isLoggedIn && (
            <Box sx={{mr: 5}}>
              <Button
                sx={{
                  background: 'var(--chart-0)',
                  '&:hover': { bgcolor: 'var(--chart-2)' },
                }}
                variant="contained"
                onClick={handleOpenModal}
                startIcon={<LoginIcon />}
              >
                Login
              </Button>
            </Box>
          )}
          {isLoggedIn && (
            <>
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
              {!profile ? (
                <Box>
                  <Button
                    variant="contained"
                    size="medium"
                    disabled={profile.id}
                  >
                    <LoginIcon />
                    {profile ? 'Connecting...' : 'Log In'}
                  </Button>
                </Box>
              ) : (
                <Box sx={{ minWidth: 120 }}>
                  <Avatar
                    src={getProfileAvatar(profile.username)}
                    alt="icon"
                    sx={{ width: 40, height: 40, color: 'var(--primary)' }}
                    className="clickable-item"
                    onClick={handleClick}
                  />
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
                    <MenuItem onClick={handleClickProfile}>
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
            </>
          )}
        </Toolbar>
      </AppBar>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '40%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: '15px',
            boxShadow: 24,
          }}
        >
          <LoginForm />
        </Box>
      </Modal>
    </>
  );
};
