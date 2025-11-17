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

export const Profile = () => {
  const { profile } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  let { profileId } = useParams();

  const getProfileAvatar = () => {
    const userName = profile?.username || 'user';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=d58d63&color=f4ede8&size=100&bold=true&rounded=true`;
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const results = await searchProfiles(query);
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
                  src={getProfileAvatar()}
                  alt="Avatar"
                  width="100"
                  height="100"
                  style={{ objectFit: 'cover' }}
                />
                <Typography sx={{ mt: 1 }}>
                  {profile?.username || 'User'}
                </Typography>
              </Box>
              <Box sx={{ mx: 5 }}>
                <Box
                  sx={{
                    border: '1px solid var(--border)',
                    height: 50,
                    borderRadius: 1,
                    p: 1,
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '&:hover': { bgcolor: 'var(--back-secondary)' },
                  }}
                  className="clickable-item"
                  onClick={() => navigate('/my_followers')}
                >
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    Follower Readers{' '}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: '1px solid var(--border)',
                    height: 50,
                    borderRadius: 1,
                    p: 1,
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '&:hover': { bgcolor: 'var(--back-secondary)' },
                  }}
                  className="clickable-item"
                  onClick={() => navigate('/my_followings')}
                >
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    Following Readers
                  </Typography>
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
                          handleSearch(e);
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
                      <i className="fa-solid fa-search text-white"></i>
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
                                src={getUserAvatar(user.name)}
                                alt={user.name}
                                width="40"
                                height="40"
                              />
                              <Typography sx={{ ml: 1, fontSize: 15 }}>
                                {user.name}
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
                <Box sx={{ mt: 2 }}>
                  <CreatePosts />
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
