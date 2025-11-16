import { useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../context/UserContext';
import { CreatePosts } from '../components/CreatePosts';
import { UserFeedTab } from '../components/UserFeedTab';
import {
  searchProfiles,
  followUser,
  unfollowUser,
  getUserStats,
} from '../services/api/follows';
import { useParams } from 'react-router';
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';

export const Profile = () => {
  const { profile } = useContext(UserContext);
  const navigate = useNavigate();
  const [followersCount, setFollowersCount] = useState(0);
  const [followingsCount, setFollowingsCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  let { profileId } = useParams();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const stats = await getUserStats(profile.id);
        setFollowersCount(stats.followers_count);
        setFollowingsCount(stats.followings_count);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const getProfileAvatar = () => {
    const userName = profile?.name || 'Usuario';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=7c3aed&color=fff&size=100&bold=true&rounded=true`;
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
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
      const results = await searchProfiles(query);
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
      setLoadingStats(true);
      await followUser(userId);
      const stats = await getUserStats(profile.id);
      setFollowingsCount(stats.followings_count);
      const newResults = [...searchResults];
      newResults[index].is_following = true;
      newResults[index].followers_count += 1;
      setSearchResults(newResults);
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleUnfollow = async (userId, index) => {
    try {
      setLoadingStats(true);
      await unfollowUser(userId);
      const stats = await getUserStats(profile.id);
      setFollowingsCount(stats.followings_count);
      const newResults = [...searchResults];
      newResults[index].is_following = false;
      newResults[index].followers_count -= 1;
      setSearchResults(newResults);
    } catch (error) {
      console.error('Error unfollowing user;', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const getUserAvatar = (userName) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=7c3aed&color=fff&size=40&bold=true&rounded=true`;
  };

  return (
    <Box>
      {/* Buffer to avoid navbar from hiding content */}
      <Box sx={{ height: 150 }} />
      {parseInt(profileId) === profile.id && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', bgcolor: 'var(--muted)', p: 3 }}>
            <Box sx={{ display: 'flex' }}>
              <Box>
                <img
                  src={getProfileAvatar()}
                  alt="Avatar"
                  width="100"
                  height="100"
                  style={{ objectFit: 'cover' }}
                />
                <Typography>{profile?.name || 'User'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', ml: 4 }}>
                <Box sx={{ minWidth: 140 }}>
                  <Box
                    className="clickable-item"
                    onClick={() => navigate('/my_followers')}
                  >
                    <Box>
                      <Typography variant="h3">
                        {loadingStats ? <CircularProgress /> : followersCount}
                      </Typography>
                      <Typography>Followers</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ minWidth: 140 }}>
                  <Box
                    className="clickable-item"
                    onClick={() => navigate('/my_followers')}
                  >
                    <Box>
                      <Typography variant="h3">
                        {loadingStats ? <CircularProgress /> : followingsCount}
                      </Typography>
                      <Typography>Following</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {/* Profiles search bar */}
              <Box>
                <Box>
                  <Box>
                    <TextField
                      type="search"
                      placeholder="Search for readers"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() =>
                        searchResults.length > 0 && setShowDropdown(true)
                      }
                      onBlur={handleBlur}
                    />
                    {searching && <CircularProgress />}
                    <Button onClick={() => handleSearchChange}>
                      <i className="fa-solid fa-search text-white"></i>
                    </Button>
                  </Box>

                  {/* Dropdown users search */}
                  {showDropdown && (
                    <Box
                      sx={{
                        maxHeight: 400,
                        overflowY: 'auto',
                        zIndex: 1050,
                      }}
                    >
                      {searchResults.map((user) => (
                        <Box
                          key={user.id}
                          className="clickable-item"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              'rgba(124, 58, 237, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              'transparent';
                          }}
                        >
                          <img
                            src={getUserAvatar(user.name)}
                            alt={user.name}
                            width="40"
                            height="40"
                          />
                          <Box>
                            <Box sx={{ fontSize: '0.9rem' }}>{user.name}</Box>
                            <small sx={{ fontSize: '0.75rem' }}>
                              {user.followers_count} followers
                            </small>
                          </Box>
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
                      ))}
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
