import { useState, useContext, useMemo } from 'react';
import { UserContext } from '../context/UserContext';
import { FeedCard } from './FeedCard';
import { Typography, Box, Tab } from '@mui/material';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';

export const ExploreFeedTab = () => {
  const { feedData, isLoadingFeed, bookDetails, profileNames } =
    useContext(UserContext);
  const [valueTabs, setValueTabs] = useState('recommendations');

  const recommendations = useMemo(
    () => feedData.filter((value) => value.content_type === 'recommendation'),
    [feedData]
  );

  const readingLists = useMemo(
    () => feedData.filter((value) => value.content_type === 'reading_list'),
    [feedData]
  );

  const reviews = useMemo(
    () => feedData.filter((value) => value.content_type === 'review'),
    [feedData]
  );

  const quotes = useMemo(
    () => feedData.filter((value) => value.content_type === 'quote'),
    [feedData]
  );

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
                        key={`${data.book_id}_${data.content_type}_${profile.id}`}
                        content={data.content_type}
                        date={data.created_at}
                        username={profile.username}
                        bookId={data.book_id}
                        bookInfo={bookInfo}
                        cover={bookInfo.image}
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
                        key={`${data.book_id}_${data.content_type}_${profile.id}`}
                        content={data.content_type}
                        date={data.created_at}
                        username={profile.username}
                        bookId={data.book_id}
                        bookInfo={bookInfo}
                        cover={bookInfo.image}
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
                        key={`${data.book_id}_${data.content_type}_${profile.id}`}
                        content={data.content_type}
                        date={data.created_at}
                        username={profile.username}
                        bookId={data.book_id}
                        bookInfo={bookInfo}
                        cover={bookInfo.image}
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
                        key={`${data.book_id}_${data.content_type}_${profile.id}`}
                        content={data.content_type}
                        date={data.created_at}
                        username={profile.username}
                        bookId={data.book_id}
                        bookInfo={bookInfo}
                        cover={bookInfo.image}
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
