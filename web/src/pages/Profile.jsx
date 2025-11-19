import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../context/UserContext';
import { CreatePosts } from '../components/CreatePosts';
import { UserFeedTab } from '../components/UserFeedTab';
import {
  searchProfiles,
  followUser,
  unfollowUser,
} from '../services/api/follows';
import { useParams } from 'react-router';
import {
  Box,
  TextField,
  Typography,
  Button,
  List,
  ListItem,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

export const Profile = () => {
  const { profile } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  let { profileId } = useParams();

  const getProfileAvatar = (username) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=d58d63&color=f4ede8&size=100&bold=true&rounded=true`;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const results = await searchProfiles(searchQuery);
      setSearchResults(results);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    }
  };

  const handleFollow = async (userId, index) => {
    try {
      setSearchQuery('');
      setShowDropdown(false);
      await followUser(userId);
      const newResults = [...searchResults];
      newResults[index].is_following = true;
      setSearchResults(newResults);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (userId, index) => {
    try {
      setSearchQuery('');
      setShowDropdown(false);
      await unfollowUser(userId);
      const newResults = [...searchResults];
      newResults[index].is_following = false;
      setSearchResults(newResults);
    } catch (error) {
      console.error('Error unfollowing user;', error);
    }
  };

  return (
    <Box>
      {/* Buffer to avoid navbar from hiding content */}
      <Box sx={{ height: 150 }} />
      {parseInt(profileId) === profile.id && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              bgcolor: 'var(--card)',
              p: 3,
              width: 770,
              borderRadius: 3,
              border: '2px solid var(--border)',
              transition: 'box-shadow 0.3s',
              '&:hover': { boxShadow: 6 },
            }}
          >
            <Box sx={{ display: 'flex' }}>
              <Box
                sx={{
                  mr: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img
                  src={getProfileAvatar(profile.username)}
                  alt="Avatar"
                  width="100"
                  height="100"
                  style={{ objectFit: 'cover' }}
                />
                <Typography sx={{ mt: 1 }}>
                  {profile?.username || 'User'}
                </Typography>
              </Box>
              <Box sx={{ mx: 4, width: '20%', p: 0 }}>
                <Box sx={{ width: '100%', height: '50%' }}>
                  <Button
                    sx={{
                      background: 'var(--chart-0)',
                      '&:hover': { bgcolor: 'var(--chart-2)' },
                      mb: 2,
                    }}
                    variant="contained"
                    onClick={() => navigate('/follows')}
                    startIcon={<PersonIcon />}
                  >
                    Fellow Readers
                  </Button>
                </Box>
                <Box sx={{ width: '100%', height: '50%' }}>
                  <CreatePosts />
                </Box>
              </Box>

              {/* Profiles search bar */}
              <Box>
                <Box>
                  <Box>
                    <TextField
                      sx={{
                        color: 'var(--text)',
                        width: 250,
                        mr: 0.5,
                      }}
                      type="search"
                      placeholder="Search readers"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearch();
                        }
                      }}
                    />
                    <Button
                      sx={{
                        height: 55,
                        bgcolor: 'var(--secondary)',
                        '&:hover': { bgcolor: 'var(--muted-foreground)' },
                      }}
                      onClick={() => handleSearch()}
                    >
                      <PersonSearchIcon />
                    </Button>
                  </Box>

                  {/* Dropdown users search */}
                  {showDropdown && (
                    <Box
                      sx={{
                        maxHeight: 250,
                        overflowY: 'auto',
                      }}
                    >
                      <List>
                        {searchResults.map((user) => (
                          <ListItem
                            sx={{
                              maxWidth: 250,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                            key={user.id}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                'rgba(124, 58, 237, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                'transparent';
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src={getProfileAvatar(user.username)}
                                alt={user.username}
                                width="40"
                                height="40"
                              />
                              <Typography sx={{ ml: 1, fontSize: 15 }}>
                                {user.username}
                              </Typography>
                            </Box>
                            <Box>
                              {user.is_following ? (
                                <Button
                                  onClick={() => handleUnfollow(user.id)}
                                  sx={{ fontSize: '0.75rem' }}
                                >
                                  Following
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => handleFollow(user.id)}
                                  sx={{ fontSize: '0.75rem' }}
                                >
                                  Follow
                                </Button>
                              )}
                            </Box>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      <Box sx={{ height: 50 }} />
      <UserFeedTab />
    </Box>
  );
};
