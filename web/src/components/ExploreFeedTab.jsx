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
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';

export const ExploreFeedTab = () => {
  const [bookDetails, setBookDetails] = useState([]);
  const [profileNames, setProfileNames] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [readingLists, setReadingLists] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const { feedData, fetchFeedData, isLoadingFeed } = useContext(UserContext);
  const [valueTabs, setValueTabs] = useState('recommendations');

  useEffect(() => {
    const initialLoad = async () => {
      await fetchFeedData();
    };
    initialLoad();
  }, []);

  useEffect(() => {
    const fetchBookCovers = async () => {
      if (feedData.length === 0) {
        return;
      }
      try {
        const dataRecommendations = feedData.filter(
          (value) => value.content_type === 'recommendation'
        );
        const dataReadingList = feedData.filter(
          (value) => value.content_type === 'reading_list'
        );
        const dataQuotes = feedData.filter(
          (value) => value.content_type === 'quote'
        );
        const dataReviews = feedData.filter(
          (value) => value.content_type === 'review'
        );

        const bookDetailPromises = feedData.map((book) =>
          getBooksDetail(book.book_id)
        );
        const [bookDetailsResult, profileDetailsResult] = await Promise.all([
          Promise.all(bookDetailPromises),
          getProfileNames(),
        ]);
        setBookDetails(bookDetailsResult);
        setProfileNames(profileDetailsResult);
        setRecommendations(dataRecommendations);
        setReadingLists(dataReadingList);
        setQuotes(dataQuotes);
        setReviews(dataReviews);
      } catch (error) {
        console.error('Failed to fetch book details:', error);
      }
    };
    fetchBookCovers();
  }, [feedData]);

  console.log(feedData);

  const handleChangeTabs = (event, newValue) => {
    setValueTabs(newValue);
  };

  return (
    <Box>
      <TabContext value={valueTabs}>
        <Box
          sx={{ mt: 5, ml: 5, mb: 4, display: 'flex', alignItems: 'center' }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 3,
            }}
          >
            <ExploreRoundedIcon
              sx={{ color: 'var(--chart-0)' }}
              fontSize="large"
            />
          </Box>
          <Box>
            <Typography
              variant="h3"
              sx={{ fontWeight: 'bold', fontFamily: 'font-serif' }}
            >
              Explore Books
            </Typography>
            <Typography sx={{ color: 'var(--muted-foreground)' }}>
              Discover what the community is reading and sharing
            </Typography>
          </Box>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTabs} centered>
            <Tab label="Read" value="recommendations" />
            <Tab label="Want" value="readingList" />
            <Tab label="Reviews" value="reviews" />
            <Tab label="Quotes" value="quotes" />
          </TabList>
        </Box>
        {isLoadingFeed ? (
          <Typography sx={{ color: 'var(--text)' }}>Loading...</Typography>
        ) : (
          <>
            <TabPanel value="recommendations">
              <Box>
                {recommendations.length === 0 ? (
                  <Box>
                    <Typography variant="h5">No books yet</Typography>
                  </Box>
                ) : (
                  recommendations.map((data) => {
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
                {readingLists.length === 0 ? (
                  <Box>
                    <Typography variant="h5">No books yet</Typography>
                  </Box>
                ) : (
                  readingLists.map((data) => {
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
                {reviews.length === 0 ? (
                  <Box>
                    <Typography variant="h5">No reviews yet</Typography>
                  </Box>
                ) : (
                  reviews.map((data) => {
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
                {quotes.length === 0 ? (
                  <Box>
                    <Typography variant="h5">No quotes yet</Typography>
                  </Box>
                ) : (
                  quotes.map((data) => {
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
