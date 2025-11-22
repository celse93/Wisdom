import { useState, useContext, useMemo, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { FeedCard } from './FeedCard';
import { Typography, Box, Tab, CircularProgress, Alert } from '@mui/material';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import ImportContactsSharpIcon from '@mui/icons-material/ImportContactsSharp';

export const ExploreFeedTab = () => {
  const {
    feedData,
    isLoadingFeed,
    bookDetails,
    profileNames,
    isLoggedIn,
    fetchFeedData,
  } = useContext(UserContext);
  const [valueTabs, setValueTabs] = useState('recommendations');

  const recommendations = useMemo(
    () => feedData.filter((value) => value.content_type === 'recommendation'),
    [feedData]
  );

  const readingLists = useMemo(
    () => feedData.filter((value) => value.content_type === 'reading'),
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

  useEffect(() => {
    const load = async () => {
      const hasPosts = feedData.length > 0;
      const hasLookupData = bookDetails.length > 0 && profileNames.length > 0;

      // if posts exist but missing remaining data (books + profiles)
      // or Feed needs refresh but isn't loading, trigger fetchData
      if (isLoggedIn && hasPosts && !hasLookupData && !isLoadingFeed) {
        try {
          console.log('Fetching posts explore...');
          await fetchFeedData();
        } catch (error) {
          console.error('Data could not be fetched: ', error);
        }
      }
    };
    load();
  }, [bookDetails.length, profileNames.length, feedData.length]);

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
              Discover what the community is reading and sharing by section
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
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
            }}
          >
            <CircularProgress size="3rem" color="var(--chart-0)" />
          </Box>
        ) : (
          <>
            <Box sx={{ height: 20 }} />
            <TabPanel value="recommendations">
              <Box>
                {recommendations.length === 0 ? (
                  <Box
                    sx={{
                      width: 770,
                      height: 'auto',
                      mx: 'auto',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Alert
                      icon={
                        <ImportContactsSharpIcon
                          sx={{ color: 'var(--chart-0)' }}
                          fontSize="inherit"
                        />
                      }
                      variant="outlined"
                      sx={{
                        border: '1px solid var(--border)',
                        color: 'var(--tex)',
                      }}
                    >
                      No posts in this category this week.
                    </Alert>
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
                        key={`${data.book_id}/${data.content_type}/${profile.id}`}
                        data={data}
                        bookInfo={bookInfo}
                        profile={profile}
                      />
                    );
                  })
                )}
              </Box>
            </TabPanel>
            <TabPanel value="readingList">
              <Box>
                {readingLists.length === 0 ? (
                  <Box
                    sx={{
                      width: 770,
                      height: 'auto',
                      mx: 'auto',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Alert
                      icon={
                        <ImportContactsSharpIcon
                          sx={{ color: 'var(--chart-0)' }}
                          fontSize="inherit"
                        />
                      }
                      variant="outlined"
                      sx={{
                        border: '1px solid var(--border)',
                        color: 'var(--tex)',
                      }}
                    >
                      No posts in this category this week.
                    </Alert>
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
                        key={`${data.book_id}/${data.content_type}/${profile.id}`}
                        data={data}
                        bookInfo={bookInfo}
                        profile={profile}
                      />
                    );
                  })
                )}
              </Box>
            </TabPanel>
            <TabPanel value="reviews">
              <Box>
                {reviews.length === 0 ? (
                  <Box
                    sx={{
                      width: 770,
                      height: 'auto',
                      mx: 'auto',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Alert
                      icon={
                        <ImportContactsSharpIcon
                          sx={{ color: 'var(--chart-0)' }}
                          fontSize="inherit"
                        />
                      }
                      variant="outlined"
                      sx={{
                        border: '1px solid var(--border)',
                        color: 'var(--tex)',
                      }}
                    >
                      No reviews this week.
                    </Alert>
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
                        key={`${data.book_id}/${data.content_type}/${profile.id}`}
                        data={data}
                        bookInfo={bookInfo}
                        profile={profile}
                      />
                    );
                  })
                )}
              </Box>
            </TabPanel>
            <TabPanel value="quotes">
              <Box>
                {quotes.length === 0 ? (
                  <Box
                    sx={{
                      width: 770,
                      height: 'auto',
                      mx: 'auto',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Alert
                      icon={
                        <ImportContactsSharpIcon
                          sx={{ color: 'var(--chart-0)' }}
                          fontSize="inherit"
                        />
                      }
                      variant="outlined"
                      sx={{
                        border: '1px solid var(--border)',
                        color: 'var(--tex)',
                      }}
                    >
                      No quotes this week.
                    </Alert>
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
                        key={`${data.book_id}/${data.content_type}/${profile.id}`}
                        data={data}
                        bookInfo={bookInfo}
                        profile={profile}
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
