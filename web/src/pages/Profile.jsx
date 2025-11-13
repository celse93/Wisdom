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

export const Profile = () => {
  const { profile } = useContext(UserContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

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
    <div className="container-fluid min-vh-100 py-4">
      {/* Buffer to avoid navbar from hiding content */}
      <div style={{ height: '88px' }}></div>
      {parseInt(profileId) === profile.id && (
        <>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-9">
                <div className="card border border-secondary mb-4">
                  <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">My Profile</h2>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div
                        className="col-12 col-md-4 d-flex flex-column justify-content-center align-items-center text-center mb-4 mb-md-0"
                        style={{ minHeight: '250px', paddingTop: '40px' }}
                      >
                        <div className="mb-3">
                          <img
                            src={getProfileAvatar()}
                            alt="Avatar"
                            className="rounded-circle"
                            width="100"
                            height="100"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <h5 className="text-white mb-2">
                          {profile?.name || 'Usuario'}
                        </h5>
                      </div>

                      <div className="col-12 col-md-8">
                        {!isEditing && (
                          <div
                            className="d-flex flex-column justify-content-center align-items-center w-100"
                            style={{ minHeight: '250px' }}
                          >
                            <div className="d-flex flex-row justify-content-center align-items-center gap-3 w-100">
                              <div style={{ minWidth: '140px' }}>
                                <div
                                  className="card bg-secondary border-0 text-center"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => navigate('/my_followers')}
                                >
                                  <div className="card-body">
                                    <h3 className="text-white mb-0">
                                      {loadingStats ? (
                                        <span className="spinner-border spinner-border-sm"></span>
                                      ) : (
                                        followersCount
                                      )}
                                    </h3>
                                    <p className="text-muted mb-0">
                                      Followers
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div style={{ minWidth: '140px' }}>
                                <div
                                  className="card bg-secondary border-0 text-center"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => navigate('/my_followings')}
                                >
                                  <div className="card-body">
                                    <h3 className="text-white mb-0">
                                      {loadingStats ? (
                                        <span className="spinner-border spinner-border-sm"></span>
                                      ) : (
                                        followingsCount
                                      )}
                                    </h3>
                                    <p className="text-muted mb-0">Following</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Profiles search bar */}
          <div
            className="position-relative flex-grow-1 mx-3"
            style={{ maxWidth: '400px' }}
          >
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-dark border-secondary">
                <i className="fa-solid fa-search text-white"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary placeholder-lightgray"
                placeholder="Busca a tus lectores aquí"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() =>
                  searchResults.length > 0 && setShowDropdown(true)
                }
                onBlur={handleBlur}
                style={{ borderLeft: 'none' }}
              />
              {searching && (
                <span className="input-group-text bg-dark border-secondary">
                  <span className="spinner-border spinner-border-sm text-white"></span>
                </span>
              )}
            </div>

            {/* Dropdown de resultados de búsqueda */}
            {showDropdown && (
              <div
                className="position-absolute w-100 mt-1 bg-dark border border-secondary rounded shadow-lg"
                style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  zIndex: 1050,
                }}
              >
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="d-flex align-items-center p-2 border-bottom border-secondary"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(124, 58, 237, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <img
                      src={getUserAvatar(user.name)}
                      alt={user.name}
                      className="rounded-circle me-2"
                      width="40"
                      height="40"
                    />
                    <div className="flex-grow-1">
                      <div
                        className="text-white fw-bold"
                        style={{ fontSize: '0.9rem' }}
                      >
                        {user.name}
                      </div>
                      <small
                        className="text-muted"
                        style={{ fontSize: '0.75rem' }}
                      >
                        {user.followers_count} seguidores
                      </small>
                    </div>
                    {user.is_following ? (
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleUnfollow(user.id)}
                        style={{ fontSize: '0.75rem' }}
                      >
                        Following
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleFollow(user.id)}
                        style={{ fontSize: '0.75rem' }}
                      >
                        Follow
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ height: '50px' }}></div>
          <CreatePosts />
        </>
      )}
      <UserFeedTab />
    </div>
  );
};
