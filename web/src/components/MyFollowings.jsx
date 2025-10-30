import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../context/UserContext';
import { unfollowUser, getFollowed } from '../services/api/follows';

export const MyFollowings = () => {
  const { profile } = useContext(UserContext);
  const [followed, setFollowed] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const followedList = await getFollowed();
        setFollowed(followedList);
      } catch (error) {
        console.error('Error fetching followings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowings();
  }, []);

  const handleUnfollow = async (userId, index) => {
    try {
      await unfollowUser(userId);
      const newFollowings = followed.filter((_, i) => i !== index);
      setFollowed(newFollowings);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const getProfileAvatar = (userName) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=7c3aed&color=fff&size=60&bold=true&rounded=true`;
  };


  console.log(followed)

  if (loading) {
    return (
      <div className="container-fluid bg-dark min-vh-100 py-4">
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="text-white">Cargando...</div>
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
              <h1 className="text-white mb-0">Siguiendo</h1>
            </div>

            {followed.length === 0 ? (
              <div className="text-center">
                <div className="card bg-dark border border-secondary">
                  <div className="card-body py-5">
                    <i className="fa-solid fa-users fa-3x text-muted mb-3"></i>
                    <h5 className="text-white">No sigues a nadie aún</h5>
                    <p className="text-muted">
                      Busca usuarios y empieza a seguir a otros lectores
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                {followed.map((user, index) => (
                  <div key={user.id} className="col-12">
                    <div className="card bg-dark border border-secondary">
                      <div className="card-body d-flex align-items-center">
                        <img
                          src={getProfileAvatar(user.username)}
                          alt={user.name}
                          className="rounded-circle me-3"
                          width="60"
                          height="60"
                        />
                        <div className="flex-grow-1">
                          <h6 className="text-white mb-0">{user.username}</h6>
                        </div>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleUnfollow(user.id, index)}
                        >
                          Dejar de seguir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
