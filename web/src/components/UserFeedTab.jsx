import { useEffect, useState, useContext, useMemo } from 'react';
import { UserContext } from '../context/UserContext';
import { FeedCard } from './FeedCard';
import { Typography, Box, Tab } from '@mui/material';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import { useParams } from 'react-router';

export const UserFeedTab = () => {
  const {
    profile,
    fetchUserFeed,
    userFeedData,
    bookDetails,
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
          <Typography sx={{ color: 'var(--text)' }}>Loading...</Typography>
        ) : userFeedData.length === 0 && !isLoadingFeed ? (
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
