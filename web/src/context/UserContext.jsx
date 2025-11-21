import { createContext, useState, useEffect, useCallback } from 'react';
import { postLogin, postLogout, postRegister } from '../services/api/auth';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentProfile,
  getCurrentUser,
  getProfileNames,
} from '../services/api/users';
import { getAllCategories } from '../services/api/feed';
import {
  getAllBooks,
  getAllUserBooks,
  getAllFollowBooks,
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
  isLoading: true,
  isLoadingFeed: true,
  isLoggedIn: false,
  userFeedData: [],
  profileNames: [],
  bookDetails: [],
  bookDetailsProfile: [],
  feedData: [],
  selectedBook: {},
  categories: [],
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [feedData, setFeedData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedBook, setSelectedBook] = useState({});
  const [bookDetails, setBookDetails] = useState([]);
  const [bookDetailsProfile, setBookDetailsProfile] = useState([]);
  const [profileNames, setProfileNames] = useState([]);
  const [userFeedData, setUserFeedData] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const [userData, profile, categoriesList] = await Promise.all([
          getCurrentUser(),
          getCurrentProfile(),
          getAllCategories(),
        ]);
        setProfile(profile);
        setUser(userData);
        setCategories(categoriesList);
        setIsLoggedIn(true);
        await fetchFeedData();
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

  const fetchFeedData = useCallback(async () => {
    try {
      setIsLoadingFeed(true);
      const dataBooks = await getAllBooks();

      const combinedData = [
        ...(Array.isArray(dataBooks.tables) ? dataBooks.tables : []),
      ];
      combinedData.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setFeedData(combinedData || []);
      setBookDetails(dataBooks.books || []);

      const profileDetailsResult = await getProfileNames();

      setProfileNames(profileDetailsResult || []);
    } catch (error) {
      console.error('Failed to fetch books data:', error);
      setFeedData([]);
      setBookDetails([]);
      setProfileNames([]);
    } finally {
      setIsLoadingFeed(false);
    }
  }, [setIsLoadingFeed, setFeedData, setBookDetails, setProfileNames]);

  const fetchUserFeed = useCallback(async () => {
    try {
      setIsLoadingFeed(true);
      const dataBooks = await getAllUserBooks();

      const combinedData = [
        ...(Array.isArray(dataBooks.tables) ? dataBooks.tables : []),
      ];
      combinedData.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setUserFeedData(combinedData || []);
      setBookDetailsProfile(dataBooks.books || []);

      const profileDetailsResult = await getProfileNames();

      setProfileNames(profileDetailsResult || []);
    } catch (error) {
      console.error('Failed to fetch books data:', error);
      setUserFeedData([]);
      setBookDetailsProfile([]);
      setProfileNames([]);
    } finally {
      setIsLoadingFeed(false);
    }
  }, [setIsLoadingFeed, setUserFeedData, setBookDetailsProfile, setProfileNames]);

  const fetchFollowFeed = useCallback(
    async (profileId) => {
      try {
        setIsLoadingFeed(true);
        const dataBooks = await getAllFollowBooks(profileId);

        const combinedData = [
          ...(Array.isArray(dataBooks.tables) ? dataBooks.tables : []),
        ];
        combinedData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setUserFeedData(combinedData || []);
        setBookDetailsProfile(dataBooks.books || []);

        const profileDetailsResult = await getProfileNames();

        setProfileNames(profileDetailsResult || []);
      } catch (error) {
        console.error('Failed to fetch books data:', error);
        setUserFeedData([]);
        setBookDetailsProfile([]);
        setProfileNames([]);
      } finally {
        setIsLoadingFeed(false);
      }
    },
    [setIsLoadingFeed, setUserFeedData, setBookDetailsProfile, setProfileNames]
  );

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      await postLogin(email, password);

      const [userData, profileData, categoriesList] = await Promise.all([
        getCurrentUser(),
        getCurrentProfile(),
        getAllCategories(),
      ]);
      setUser(userData);
      setProfile(profileData);
      setCategories(categoriesList);
      setIsLoggedIn(true);
      await fetchFeedData();
      navigate('/home');
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
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/');
      setIsLoading(false);
      setIsLoggedIn(false);
      setUser({});
      setProfile({});
      setFeedData([]);
      setUserFeedData([]);
      setCategories([]);
      setProfileNames([]);
      setSelectedBook({});
    }
  };

  const register = async (username, email, password) => {
    try {
      setIsLoading(true);
      await postRegister(username, email, password);
      await postLogin(email, password);

      const [userData, profileData, categoriesList] = await Promise.all([
        getCurrentUser(),
        getCurrentProfile(),
        getAllCategories(),
      ]);
      setUser(userData);
      setProfile(profileData);
      setCategories(categoriesList);
      setIsLoggedIn(true);
      await fetchFeedData();
      navigate('/home');
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
        categories,
        bookDetailsProfile,
        setBookDetailsProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
