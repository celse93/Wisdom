import { getBooksDetail } from '../services/api/books';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { postReadingList, postRecommendations } from '../services/api/books';
import { getProfileNames } from '../services/api/users';
import { FeedCard } from './FeedCard';
import {
  Typography,
  Box,
} from '@mui/material';

export const Feed = () => {
  const [bookDetails, setBookDetails] = useState([]);
  const [profileNames, setProfileNames] = useState([]);
  const [fetchComplete, setFetchComplete] = useState(false);
  const { fetchFeedData, feedData, isLoadingFeed, } =
    useContext(UserContext);

  useEffect(() => {
    const initialLoad = async () => {
      await fetchFeedData();
    };
    initialLoad();
  }, []);

  useEffect(() => {
    const fetchBookCovers = async () => {
      if (feedData.length == 0) {
        setFetchComplete(true);
        return;
      }
      try {
        const bookDetailPromises = feedData.map((book) =>
          getBooksDetail(book.book_id)
        );
        const [bookDetailsResult, profileDetailsResult] = await Promise.all([
          Promise.all(bookDetailPromises),
          getProfileNames(),
        ]);
        setBookDetails(bookDetailsResult);
        setProfileNames(profileDetailsResult);
      } catch (error) {
        console.error('Failed to fetch book details:', error);
      }
    };
    fetchBookCovers();
  }, [feedData]);

  const handleReadingList = async (book) => {
    try {
      const saveBook = await postReadingList(book.book_id);
      alert(`Libro "${book.title}": ${saveBook['message']}`);
    } catch {
      alert('¡Error! Libro ya registrado');
    }
  };

  const handleRecommendations = async (book) => {
    try {
      const saveBook = await postRecommendations(book.book_id);
      alert(`Libro "${book.title}": ${saveBook['message']}`);
    } catch {
      alert('¡Error! Libro ya registrado');
    }
  };

  return (
    <>
      <Box style={{ height: '100px' }}></Box>
      {isLoadingFeed ? (
        <Typography sx={{ color: 'var(--text)' }}>Loading...</Typography>
      ) : feedData.length === 0 && fetchComplete && !isLoadingFeed ? (
        <Box>
          <Typography variant="h5" sx={{ color: 'var(--text)' }}>
            No posts yet
          </Typography>
        </Box>
      ) : (
        <Box>
          {feedData.map((data) => {
            {
              /* finds the associated book to access its description and coverId*/
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
      )}
    </>
  );
};
