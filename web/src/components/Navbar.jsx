import { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { UserContext } from '../context/UserContext';
import { searchUsers, followUser, unfollowUser } from '../services/api/follows';
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

export const Navbar = () => {
  const { logout, profile, user } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
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

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setSearching(true);
    try {
      const results = await searchUsers(query);
      setSearchResults(results);
      setShowDropdown(results.length > 0);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleFollow = async (userId, index) => {
    try {
      await followUser(userId);
      const newResults = [...searchResults];
      newResults[index].is_following = true;
      newResults[index].followers_count += 1;
      setSearchResults(newResults);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (userId, index) => {
    try {
      await unfollowUser(userId);
      const newResults = [...searchResults];
      newResults[index].is_following = false;
      newResults[index].followers_count -= 1;
      setSearchResults(newResults);
    } catch (error) {
      console.error('Error unfollowing user;', error);
    }
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
            onClick={() => navigate('/')}
          >
            <AutoStoriesOutlinedIcon
              sx={{
                mr: 0.5,
              }}
            />
            <Typography>Feed</Typography>
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
