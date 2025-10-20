import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../context/UserContext';
import { getUserStats } from '../services/api/follows';
import { CreatePosts } from '../components/CreatePosts';
import { FeedTab } from '../components/FeedBar';

export const Profile = () => {
  const { profile } = useContext(UserContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingsCount, setFollowingsCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (profile?.id) {
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
      }
    };
    fetchStats();
  }, [profile?.id]);

  const getProfileAvatar = () => {
    const userName = profile?.name || 'Usuario';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=7c3aed&color=fff&size=100&bold=true&rounded=true`;
  };

  return (
    <div className="container-fluid min-vh-100 py-4">
      {/* Espacio para evitar que la navbar tape la tarjeta */}
      <div style={{ height: '88px' }}></div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9">
            <div className="card border border-secondary mb-4">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h2 className="mb-0">Mi Perfil</h2>
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
                                <p className="text-muted mb-0">Seguidores</p>
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
                                <p className="text-muted mb-0">Siguiendo</p>
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
      <div style={{ height: '50px' }}></div>
      <CreatePosts />
      <FeedTab />
    </div>
  );
};
