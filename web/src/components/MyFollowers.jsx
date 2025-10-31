import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowings,
} from '../services/api/follows';

export const MyFollowers = () => {
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowers = async () => {
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
        setLoading(false);
      }
    };
    fetchFollowers();
  }, []);

  const handleFollow = async (userId) => {
    try {
      await followUser(userId);
      const newFollow = followers.find((user) => user.id === userId);
      setFollowings((prevFollowings) => [...prevFollowings, newFollow]);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

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

  const getProfileAvatar = (userName) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=7c3aed&color=fff&size=60&bold=true&rounded=true`;
  };

  const handleOnClick = (followId) => {
    navigate(`/profile/${followId}`);
  };

  if (loading) {
    return (
      <div className="container-fluid bg-dark min-vh-100 py-4">
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="text-white">Cargando seguidores...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-dark min-vh-100 py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="d-flex align-items-center mb-4">
              <button
                className="btn btn-link text-white p-0 me-3"
                onClick={() => navigate(-1)}
              >
                <i className="fa-solid fa-arrow-left fa-lg"></i>
              </button>
              <h1 className="text-white mb-0">Followers</h1>
            </div>

            {followers.length === 0 ? (
              <div className="text-center">
                <div className="card bg-dark border border-secondary">
                  <div className="card-body py-5">
                    <i className="fa-solid fa-users fa-3x text-muted mb-3"></i>
                    <h5 className="text-white">No tienes seguidores aún</h5>
                    <p className="text-muted">
                      Cuando otros usuarios te sigan, aparecerán aquí
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                {followers.map((follower) => {
                  const isFollowing = followings.find(
                    (following) => following.id === follower.id
                  );

                  return (
                    <div key={follower.id} className="col-12">
                      <div className="card bg-dark border border-secondary">
                        <div className="card-body d-flex align-items-center">
                          <div
                            className="d-flex align-items-center clickable-item w-75"
                            onClick={()=> handleOnClick(follower.id)}
                          >
                            <img
                              src={getProfileAvatar(follower.username)}
                              alt={follower.name}
                              className="rounded-circle me-3"
                              width="60"
                              height="60"
                            />
                            <h6 className="text-white mb-0">
                              {follower.username}
                            </h6>
                          </div>
                          <div>
                            {isFollowing ? (
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handleUnfollow(follower.id)}
                              >
                                Following
                              </button>
                            ) : (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleFollow(follower.id)}
                              >
                                Follow
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
