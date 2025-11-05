import { useContext, useMemo, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { FeedCard } from './FeedCard';
import { Typography, Box } from '@mui/material';

export const Feed = () => {
  const { feedData, isLoadingFeed, bookDetails, profileNames, fetchFeedData } =
    useContext(UserContext);

  useEffect(() => {
    const initialLoad = async () => {
      await fetchFeedData();
    };
    initialLoad();
  }, []);

  const posts = useMemo(() => [...feedData], [feedData]);

  return (
    <>
      <Box style={{ height: '100px' }}></Box>
      {isLoadingFeed ? (
        <Typography sx={{ color: 'var(--text)' }}>Loading...</Typography>
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
          })}
        </Box>
      )}
    </>
  );
};
