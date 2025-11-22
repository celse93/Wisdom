import { useContext, useMemo, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { FeedCard } from './FeedCard';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import ImportContactsSharpIcon from '@mui/icons-material/ImportContactsSharp';

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
      if (isLoggedIn && hasPosts && !hasLookupData && !isLoadingFeed) {
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
      <Box sx={{ mt: 3 }} />
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
            sx={{ border: '1px solid var(--border)', color: 'var(--tex)' }}
          >
            No posts this week. Be the first to share!
          </Alert>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              width: 770,
              height: 'auto',
              mx: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mr: 2,
              }}
            >
              <GroupIcon fontSize="large" />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                  color: 'var(--text)',
                }}
              >
                Community Feed
              </Typography>
              <Typography
                sx={{
                  color: 'var(--muted-foreground)',
                }}
              >
                See what the community is reading this week
              </Typography>
            </Box>
          </Box>
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
        </>
      )}
    </>
  );
};
