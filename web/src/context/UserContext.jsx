import { createContext, useState, useEffect } from 'react';
import { postLogin, postLogout, postRegister } from '../services/api/auth';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentProfile,
  getCurrentUser,
  getProfileNames,
} from '../services/api/users';
import {
  getAllQuotes,
  getAllReviews,
  getAllReadingLists,
  getAllRecommendations,
  getUserQuotes,
  getUserReviews,
  getUserReadingLists,
  getUserRecommendations,
  getFollowQuotes,
  getFollowReadingLists,
  getFollowReviews,
  getFollowRecommendations,
} from '../services/api/feed';
import {
  getBooksDetail,
  getAllBooks,
  getAllUserBooks,
  getAllFollowBooks
} from '../services/api/books';

export const UserContext = createContext({
  user: {},
  profile: {},
  login: () => {},
  logout: () => {},
  selectBook: () => {},
  register: () => {},
  fetchFeedData: () => {},
  fetchUserFeed: () => {},
  fetchFollowFeed: () => {},
  isLoading: false,
  userFeedData: [],
  profileNames: [],
  bookDetails: [],
  feedData: [],
  selectedBook: {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [feedData, setFeedData] = useState([]);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedBook, setSelectedBook] = useState({});
  const [bookDetails, setBookDetails] = useState([]);
  const [profileNames, setProfileNames] = useState([]);
  const [userFeedData, setUserFeedData] = useState([]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const [userData, profile] = await Promise.all([
          getCurrentUser(),
          getCurrentProfile(),
        ]);
        setProfile(profile);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Session restoration failed, user logged out: ', error);
        setIsLoggedIn(false);
        setUser({});
        setProfile({});
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const fetchFeedData = async () => {
    setIsLoadingFeed(true)
    try {
      const dataBooks = await getAllBooks();

      const combinedData = [
        ...(Array.isArray(dataBooks.tables) ? dataBooks.tables : []),
      ];
      combinedData.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setFeedData(combinedData);
      setBookDetails(dataBooks.books);

      const profileDetailsResult = await getProfileNames();

      setProfileNames(profileDetailsResult);
    } catch (error) {
      console.error('Failed to fetch books data:', error);
      setFeedData([]);
      setBookDetails([]);
      setProfileNames([]);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  const fetchUserFeed = async () => {
    setIsLoadingFeed(true)
    try {
      const dataBooks = await getAllUserBooks();

      const combinedData = [
        ...(Array.isArray(dataBooks.tables) ? dataBooks.tables : []),
      ];
      combinedData.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setUserFeedData(combinedData);
      setBookDetails(dataBooks.books);

      const profileDetailsResult = await getProfileNames();

      setProfileNames(profileDetailsResult);
    } catch (error) {
      console.error('Failed to fetch books data:', error);
      setUserFeedData([]);
      setBookDetails([]);
      setProfileNames([]);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  const fetchFollowFeed = async (profileId) => {
    setIsLoadingFeed(true)
    try {
      const dataBooks = await getAllFollowBooks(profileId);

      const combinedData = [
        ...(Array.isArray(dataBooks.tables) ? dataBooks.tables : []),
      ];
      combinedData.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setUserFeedData(combinedData);
      setBookDetails(dataBooks.books);

      const profileDetailsResult = await getProfileNames();

      setProfileNames(profileDetailsResult);
    } catch (error) {
      console.error('Failed to fetch books data:', error);
      setUserFeedData([]);
      setBookDetails([]);
      setProfileNames([]);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  const login = async (email, password) => {
    try {
      await postLogin(email, password);

      const [userData, profileData] = await Promise.all([
        getCurrentUser(),
        getCurrentProfile(),
      ]);
      setUser(userData);
      setProfile(profileData);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setUser({});
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await postLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/login');
      setIsLoading(false);
      setIsLoggedIn(false);
      setUser({});
      setProfile({});
      setFeedData([]);
    }
  };

  const register = async (name, email, password) => {
    try {
      await postRegister(name, email, password);
      await postLogin(email, password);

      const [userData, profileData] = await Promise.all([
        getCurrentUser(),
        getCurrentProfile(),
      ]);
      setUser(userData);
      setProfile(profileData);
      navigate('/profile');
    } catch (error) {
      console.error('Register error:', error.message);
      setUser({});
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const selectBook = async (book) => {
    setIsLoading(true);
    try {
      setSelectedBook(book);
      return true;
    } catch (error) {
      console.error('Failed to select book', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        profile,
        setProfile,
        login,
        logout,
        register,
        isLoading,
        selectBook,
        selectedBook,
        fetchFeedData,
        feedData,
        isLoggedIn,
        isLoadingFeed,
        bookDetails,
        profileNames,
        fetchUserFeed,
        fetchFollowFeed,
        userFeedData,
        setBookDetails,
        setProfileNames,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
