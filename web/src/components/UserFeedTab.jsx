import { getBooksDetail } from '../services/api/books';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { getProfileNames } from '../services/api/users';
import { FeedCard } from './FeedCard';
import {
  Typography,
  Box,
  Tab,
} from '@mui/material';
import { TabList, TabPanel, TabContext } from '@mui/lab';

export const UserFeedTab = () => {
  const [bookDetails, setBookDetails] = useState([]);
  const [profileNames, setProfileNames] = useState([]);
  const [fetchComplete, setFetchComplete] = useState(false);
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [userReadingLists, setUserReadingLists] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [userQuotes, setUserQuotes] = useState([]);
  const { userFeedData, fetchUserFeedData, isLoadingFeed } =
    useContext(UserContext);
  const [valueTabs, setValueTabs] = useState('all');

  useEffect(() => {
    const initialLoad = async () => {
      await fetchUserFeedData();
    };
    initialLoad();
  }, []);

  useEffect(() => {
    const fetchBookCovers = async () => {
      if (userFeedData.length === 0) {
        setFetchComplete(true);
        return;
      }
      try {
        const dataRecommendations = userFeedData.filter(
          (value) => value.content_type === 'recommendation'
        );
        const dataReadingList = userFeedData.filter(
          (value) => value.content_type === 'reading_list'
        );
        const dataQuotes = userFeedData.filter(
          (value) => value.content_type === 'quote'
        );
        const dataReviews = userFeedData.filter(
          (value) => value.content_type === 'review'
        );

        const bookDetailPromises = userFeedData.map((book) =>
          getBooksDetail(book.book_id)
        );
        const [bookDetailsResult, profileDetailsResult] = await Promise.all([
          Promise.all(bookDetailPromises),
          getProfileNames(),
        ]);
        setBookDetails(bookDetailsResult);
        setProfileNames(profileDetailsResult);
        setUserRecommendations(dataRecommendations);
        setUserReadingLists(dataReadingList);
        setUserQuotes(dataQuotes);
        setUserReviews(dataReviews);
        setFetchComplete(true);
      } catch (error) {
        console.error('Failed to fetch book details:', error);
      }
    };
    fetchBookCovers();
  }, [userFeedData]);

  const handleChangeTabs = (event, newValue) => {
    setValueTabs(newValue);
  };

  console.log(isLoadingFeed);

  return (
    <Box>
      <TabContext value={valueTabs}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTabs} centered>
            <Tab label="All" value="all" />
            <Tab label="Read" value="recommendations" />
            <Tab label="Want" value="readingList" />
            <Tab label="Reviews" value="reviews" />
            <Tab label="Quotes" value="quotes" />
          </TabList>
        </Box>
        {isLoadingFeed ? (
          <Typography sx={{ color: 'var(--text)' }}>Loading...</Typography>
        ) : userFeedData.length === 0 && fetchComplete && !isLoadingFeed ? (
          <Box>
            <Typography variant="h5" sx={{ color: 'var(--text)' }}>
              No posts yet
            </Typography>
          </Box>
        ) : (
          <>
            <TabPanel value="all">
              <Box>
                <Box>
                  {userFeedData.map((data) => {
                    {
                      /* finds the associated book to access its description and coverId */
                    }
                    const bookInfo = bookDetails.find(
                      (book) => book.book_id == data.book_id
                    );
                    {
                      /* finds the associated profile to access the username */
                    }
                    const profile = profileNames.find(
                      (profile) => profile.id == data.user_id
                    );
                    if (!bookInfo || !profile) {
                      return null;
                    }
                    return (
                      <FeedCard
                        content={data.content_type}
                        date={data.created_at}
                        username={profile.username}
                        bookId={data.book_id}
                        bookInfo={bookInfo}
                        cover={bookInfo.cover}
                        title={bookInfo.title}
                        author={bookInfo.author}
                        text={data.text}
                      />
                    );
                  })}
                </Box>
              </Box>
            </TabPanel>
            <TabPanel value="recommendations">
              <Box>
                {userRecommendations.length === 0 ? (
                  <Box>
                    <Typography variant="h5">No books yet</Typography>
                  </Box>
                ) : (
                  userRecommendations.map((data) => {
                    const bookInfo = bookDetails.find(
                      (book) => book.book_id === data.book_id
                    );
                    const profile = profileNames.find(
                      (profile) => profile.id === data.user_id
                    );
                    if (!bookInfo || !profile) {
                      return null;
                    }
                    return (
                      <FeedCard
                        content={data.content_type}
                        date={data.created_at}
                        username={profile.username}
                        bookId={data.book_id}
                        bookInfo={bookInfo}
                        cover={bookInfo.cover}
                        title={bookInfo.title}
                        author={bookInfo.author}
                        text={data.text}
                      />
                    );
                  })
                )}
              </Box>
            </TabPanel>
            <TabPanel value="readingList">
              <Box>
                {userReadingLists.length === 0 ? (
                  <Box>
                    <Typography variant="h5">No books yet</Typography>
                  </Box>
                ) : (
                  userReadingLists.map((data) => {
                    const bookInfo = bookDetails.find(
                      (book) => book.book_id == data.book_id
                    );
                    const profile = profileNames.find(
                      (profile) => profile.id == data.user_id
                    );
                    if (!bookInfo || !profile) {
                      return null;
                    }
                    return (
                      <FeedCard
                        content={data.content_type}
                        date={data.created_at}
                        username={profile.username}
                        bookId={data.book_id}
                        bookInfo={bookInfo}
                        cover={bookInfo.cover}
                        title={bookInfo.title}
                        author={bookInfo.author}
                        text={data.text}
                      />
                    );
                  })
                )}
              </Box>
            </TabPanel>
            <TabPanel value="reviews">
              <Box>
                {userReviews.length === 0 ? (
                  <Box>
                    <Typography variant="h5">No reviews yet</Typography>
                  </Box>
                ) : (
                  userReviews.map((data) => {
                    const bookInfo = bookDetails.find(
                      (book) => book.book_id == data.book_id
                    );
                    const profile = profileNames.find(
                      (profile) => profile.id == data.user_id
                    );
                    if (!bookInfo || !profile) {
                      return null;
                    }
                    return (
                      <FeedCard
                        content={data.content_type}
                        date={data.created_at}
                        username={profile.username}
                        bookId={data.book_id}
                        bookInfo={bookInfo}
                        cover={bookInfo.cover}
                        title={bookInfo.title}
                        author={bookInfo.author}
                        text={data.text}
                      />
                    );
                  })
                )}
              </Box>
            </TabPanel>
            <TabPanel value="quotes">
              <Box>
                {userQuotes.length === 0 ? (
                  <Box>
                    <Typography variant="h5">No quotes yet</Typography>
                  </Box>
                ) : (
                  userQuotes.map((data) => {
                    const bookInfo = bookDetails.find(
                      (book) => book.book_id == data.book_id
                    );
                    const profile = profileNames.find(
                      (profile) => profile.id == data.user_id
                    );
                    if (!bookInfo || !profile) {
                      return null;
                    }
                    return (
                      <FeedCard
                        content={data.content_type}
                        date={data.created_at}
                        username={profile.username}
                        bookId={data.book_id}
                        bookInfo={bookInfo}
                        cover={bookInfo.cover}
                        title={bookInfo.title}
                        author={bookInfo.author}
                        text={data.text}
                      />
                    );
                  })
                )}
              </Box>
            </TabPanel>
          </>
        )}
      </TabContext>
    </Box>
  );
};
