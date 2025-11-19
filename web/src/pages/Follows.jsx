import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  unfollowUser,
  getFollowings,
  followUser,
  getFollowers,
} from '../services/api/follows';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';


export const Follows = () => {
  const [followings, setFollowings] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollows = async () => {
      try {
        const [followersList, followingsList] = await Promise.all([
          getFollowers(),
          getFollowings(),
        ]);
        setFollowers(followersList);
        setFollowings(followingsList);
      } catch (error) {
        console.error('Error fetching followers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFollows();
  }, [followers.length, followings.length]);

  const handleUnfollow = async (userId) => {
    try {
      await unfollowUser(userId);
      setFollowings((prevFollowings) =>
        prevFollowings.filter((following) => following.id !== userId)
      );
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await followUser(userId);
      const newFollow = followers.find((user) => user.id === userId);
      setFollowings((prevFollowings) => [...prevFollowings, newFollow]);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const getProfileAvatar = (userName) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=d58d63&color=f4ede8&size=50&bold=true&rounded=true`;
  };

  const handleOnClick = (followId) => {
    navigate(`/profile/${followId}`);
  };

  return (
    <>
      <Box sx={{ height: 100 }} />
      {isLoading ? (
        <Box sx={{ width: '100%', py: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
            py: 4,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ width: '60%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Button onClick={() => navigate(-1)}>
                <i className="fa-solid fa-arrow-left fa-lg"></i>
                <Typography sx={{ ml: 3 }} variant="h6">
                  {' '}
                  Return{' '}
                </Typography>
              </Button>
            </Box>

            {followings.length === 0 ? (
              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Card>
                  <CardContent sx={{ py: 5 }}>
                    <i className="fa-solid fa-users fa-3x  mb-3"></i>
                    <Typography variant="h5">No following yet</Typography>
                    <Typography>Search for readers and follow them</Typography>
                  </CardContent>
                </Card>
              </Box>
            ) : (
              <Box
                sx={{ width: '100%', maxHeight: 500, overflowY: 'auto', mb: 5 }}
              >
                <Typography sx={{ fontWeight: 'bold', mb: 1 }} variant="h5">
                  Following Readers
                </Typography>
                {followings.map((following) => (
                  <Card
                    key={following.id}
                    sx={{ border: '1px solid var(--chart-0)', mb: 1 }}
                  >
                    <CardContent
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '75%',
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box
                          sx={{ display: 'flex' }}
                          className="clickable-item"
                          onClick={() => handleOnClick(following.id)}
                        >
                          <img
                            src={getProfileAvatar(following.username)}
                            alt={following.username}
                            width="50"
                            height="50"
                          />
                          <Box
                            sx={{
                              ml: 1,
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Typography variant="h6">
                              {following.username}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleUnfollow(following.id)}
                          >
                            Following
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            {followers.length === 0 ? (
              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Card>
                  <CardContent sx={{ py: 5 }}>
                    <i className="fa-solid fa-users fa-3x  mb-3"></i>
                    <Typography variant="h5">No followers yet</Typography>
                  </CardContent>
                </Card>
              </Box>
            ) : (
              <Box sx={{ width: '100%', maxHeight: 500, overflowY: 'auto' }}>
                <Typography sx={{ fontWeight: 'bold', mb: 1 }} variant="h5">
                  Follower Readers
                </Typography>
                {followers.map((follower) => {
                  const isFollowing = followings.find(
                    (following) => following.id === follower.id
                  );

                  return (
                    <Card
                      key={follower.id}
                      sx={{ border: '1px solid var(--chart-0)', mb: 1 }}
                    >
                      <CardContent
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '75%',
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box
                            sx={{ display: 'flex' }}
                            className="clickable-item"
                            onClick={() => handleOnClick(follower.id)}
                          >
                            <img
                              src={getProfileAvatar(follower.username)}
                              alt={follower.username}
                              width="50"
                              height="50"
                            />
                            <Box
                              sx={{
                                ml: 1,
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Typography variant="h6">
                                {follower.username}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            {isFollowing ? (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleUnfollow(follower.id)}
                              >
                                Unfollow
                              </Button>
                            ) : (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleFollow(follower.id)}
                              >
                                Follow
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};
