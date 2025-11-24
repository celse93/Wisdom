import { useEffect, useState, useContext, useMemo } from 'react';
import { UserContext } from '../context/UserContext';
import { FeedCard } from './FeedCard';
import { Box, Tab, CircularProgress, Alert } from '@mui/material';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import { useParams } from 'react-router';
import ImportContactsSharpIcon from '@mui/icons-material/ImportContactsSharp';

export const UserFeedTab = () => {
  const {
    user,
    profile,
    fetchUserFeed,
    userFeedData,
    bookDetailsProfile,
    profileNames,
    fetchFollowFeed,
    isLoadingFeed,
  } = useContext(UserContext);
  const [valueTabs, setValueTabs] = useState('all');
  let { profileId } = useParams();

  useEffect(() => {
    const initialLoad = async () => {
      if (profile.id === parseInt(profileId)) {
        {
          /* Fecthing data of the logged user */
        }
        await fetchUserFeed();
      } else {
        {
          /* Fecthing data from another user */
        }
        await fetchFollowFeed(profileId);
      }
    };
    initialLoad();
  }, [profileId]);

  const userRecommendations = useMemo(
    () =>
      userFeedData.filter((value) => value.content_type === 'recommendation'),
    [userFeedData]
  );

  const userReadingLists = useMemo(
    () => userFeedData.filter((value) => value.content_type === 'reading'),
    [userFeedData]
  );

  const userReviews = useMemo(
    () => userFeedData.filter((value) => value.content_type === 'review'),
    [userFeedData]
  );

  const userQuotes = useMemo(
    () => userFeedData.filter((value) => value.content_type === 'quote'),
    [userFeedData]
  );

  const handleChangeTabs = (event, newValue) => {
    setValueTabs(newValue);
  };

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
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size="3rem" color="var(--chart-0)" />
          </Box>
        ) : userFeedData.length === 0 && !isLoadingFeed ? (
          <>
            <Box sx={{ height: 20 }} />
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
                No posts yet.{' '}
                {user.user.id == profileId ? 'Share your first book!' : ''}
              </Alert>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ height: 20 }} />
            <TabPanel value="all">
              <Box>
                <Box>
                  {userFeedData.map((data) => {
                    {
                      /* finds the associated book to access its description and coverId */
                    }
                    const bookInfo = bookDetailsProfile.find(
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
                        key={`${data.book_id}/${data.content_type}/${profile.id}`}
                        data={data}
                        bookInfo={bookInfo}
                        profile={profile}
                      />
                    );
                  })}
                </Box>
              </Box>
            </TabPanel>
            <TabPanel value="recommendations">
              <Box>
                {userRecommendations.length === 0 ? (
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
                      No posts in this category yet.
                    </Alert>
                  </Box>
                ) : (
                  userRecommendations.map((data) => {
                    const bookInfo = bookDetailsProfile.find(
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
                {userReadingLists.length === 0 ? (
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
                      No posts in this category yet.
                    </Alert>
                  </Box>
                ) : (
                  userReadingLists.map((data) => {
                    const bookInfo = bookDetailsProfile.find(
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
                {userReviews.length === 0 ? (
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
                      No reviews yet.
                    </Alert>
                  </Box>
                ) : (
                  userReviews.map((data) => {
                    const bookInfo = bookDetailsProfile.find(
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
                {userQuotes.length === 0 ? (
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
                      No quotes yet.
                    </Alert>
                  </Box>
                ) : (
                  userQuotes.map((data) => {
                    const bookInfo = bookDetailsProfile.find(
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
