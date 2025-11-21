import { useContext, useMemo, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { FeedCard } from './FeedCard';
import { Typography, Box, CircularProgress } from '@mui/material';

export const Feed = () => {
  const {
    feedData,
    isLoadingFeed,
    bookDetails,
    profileNames,
    fetchFeedData,
    isLoggedIn,
  } = useContext(UserContext);

  const posts = useMemo(() => [...feedData], [feedData]);

  useEffect(() => {
    const load = async () => {
      const hasPosts = posts.length > 0;
      const hasLookupData = bookDetails.length > 0 && profileNames.length > 0;

      // if posts exist but missing remaining data (books + profiles)
      // or Feed needs refresh but isn't loading, trigger fetchData
      if (isLoggedIn && hasPosts && hasLookupData && !isLoadingFeed) {
        try {
          console.log('Fetching posts feed...');
          await fetchFeedData();
        } catch (error) {
          console.error('Data could not be fetched: ', error);
        }
      }
    };
    load();
  }, [posts.length, bookDetails.length, profileNames.length]);

  return (
    <>
      <Box sx={{ mt: 5 }}></Box>
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
      ) : posts.length === 0 && !isLoadingFeed ? (
        <Box>
          <Typography variant="h5" sx={{ color: 'var(--text)' }}>
            No posts yet
          </Typography>
        </Box>
      ) : (
        <Box>
          {posts.map((data) => {
            {
              /* finds the associated book to access its info */
            }
            const bookInfo = bookDetails.find(
              (book) => book.book_id == data.book_id
            );
            {
              /* finds the associated profile to access the username*/
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
      )}
    </>
  );
};
