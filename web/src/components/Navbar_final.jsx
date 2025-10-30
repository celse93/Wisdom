import { useContext, useState } from 'react';
import { NavLink } from 'react-router';
import { UserContext } from '../context/UserContext';
import { searchProfiles, followUser, unfollowUser } from '../services/api/follows';

export const NavBarFinal = () => {
  const { logout, profile } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const getProfileAvatar = () => {
    const userName = profile?.name || 'Usuario';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=7c3aed&color=fff&size=100&bold=true&rounded=true`;
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

  const getUserAvatar = (userName) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=7c3aed&color=fff&size=40&bold=true&rounded=true`;
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  return (
    <nav className="navbar navbar-dark bg-transparent navbar-expand-lg">
      <div className="nav container-fluid d-flex justify-content-between align-items-center mx-3">
        <div className="nav-item dropdown">
          <button
            className="nav-link nav-item"
            type="button"
            data-bs-toggle="dropdown"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <ul className="dropdown-menu">
            <li>
              <NavLink className="dropdown-item" to="/">
                Home
              </NavLink>
            </li>
          </ul>
        </div>

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
              onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
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
              {searchResults.map((user, index) => (
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
                      onClick={() => handleUnfollow(user.id, index)}
                      style={{ fontSize: '0.75rem' }}
                    >
                      Siguiendo
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleFollow(user.id, index)}
                      style={{ fontSize: '0.75rem' }}
                    >
                      Seguir
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="nav-item dropdown">
          <img
            src={getProfileAvatar()}
            alt="Avatar"
            className="rounded-circle"
            data-bs-toggle="dropdown"
            role="button"
            width="40"
            height="40"
            style={{ objectFit: 'cover' }}
          />
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <NavLink className="dropdown-item" to="/profile">
                Perfil
              </NavLink>
            </li>
            <li>
              <a className="dropdown-item text-danger" onClick={handleLogout}>
                Cerrar sesión
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
