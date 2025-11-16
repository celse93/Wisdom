import { useContext, useMemo, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { FeedCard } from './FeedCard';
import { Typography, Box, CircularProgress } from '@mui/material';

export const Feed = () => {
  const { feedData, isLoadingFeed, bookDetails, profileNames } =
    useContext(UserContext);

  const posts = useMemo(() => [...feedData], [feedData]);

  return (
    <>
      <Box style={{ height: '50px' }}></Box>
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
