import { getBooksDetail } from '../services/api/books';
import { useNavigate } from 'react-router';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { postReadingList, postRecommendations } from '../services/api/books';
import { getProfileNames } from '../services/api/users';
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Link,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';

export const Feed = () => {
  const [bookDetails, setBookDetails] = useState([]);
  const [profileNames, setProfileNames] = useState([]);
  const [fetchComplete, setFetchComplete] = useState(false);
  const navigate = useNavigate();
  const { selectBook, fetchFeedData, feedData } = useContext(UserContext);

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
      } finally {
        setFetchComplete(true);
      }
    };
    fetchBookCovers();
  }, [feedData]);

  console.log(feedData);
  console.log(bookDetails);
  console.log(profileNames);

  const handleBookClick = async (bookId) => {
    const fetchBook = await selectBook(bookId);
    if (fetchBook) {
      navigate('/book');
    } else {
      console.log('Could not navigate to book page');
    }
  };

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
      {!fetchComplete ? (
        <Typography sx={{ color: 'text.primary' }}>Loading...</Typography>
      ) : bookDetails.length == 0 && fetchComplete ? (
        <Box>
          <Typography variant="h5">No posts yet</Typography>
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
              <Card
                sx={{
                  mb: 1,
                  py: 1,
                  width: 770,
                  height: 'auto',
                  mx: 'auto',
                  borderRadius: 3,
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: 6 },
                }}
                key={data.book_id}
              >
                <CardHeader
                  avatar={
                    <Link
                      href=""
                      underline="none"
                      color="inherit"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                    >
                      <Avatar
                        alt="icon"
                        sx={{ width: 40, height: 40, color: 'var(--primary)' }}
                      >
                        <AutoStoriesRoundedIcon />
                      </Avatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {profile.username}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'var(--primary)' }}
                        >
                          {data.created_at}
                        </Typography>
                      </Box>
                    </Link>
                  }
                  action={
                    <Chip
                      size="small"
                      label={data.content_type}
                      icon={'abc'}
                      sx={{
                        bgcolor: 'secondary.light',
                        color: 'secondary.contrastText',
                        borderColor: 'secondary.main',
                        fontWeight: 'medium',
                      }}
                    />
                  }
                  sx={{ paddingBottom: 0, paddingRight: 3 }}
                />
                <CardContent
                  sx={{ paddingTop: 0, paddingBottom: '16px !important' }}
                >
                  <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                    <Box
                      sx={{ flexShrink: 0 }}
                      onClick={() => handleBookClick(data.book_id)}
                    >
                      <img
                        alt="Book cover"
                        style={{
                          height: 128,
                          width: 96,
                          borderRadius: 8,
                          objectFit: 'cover',
                        }}
                        className="clickable-item"
                        src={
                          bookInfo.cover_id != ''
                            ? `https://covers.openlibrary.org/b/id/${bookInfo.cover_id}-M.jpg`
                            : 'https://imageplaceholder.net/300x300/eeeeee/131313?text=sin+portada+de+libro'
                        }
                      />
                    </Box>
                    <Box sx={{ flexGrow: 1, paddingTop: 1 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ fontWeight: 'semibold', lineHeight: 'tight' }}
                      >
                        {bookInfo.title}
                      </Typography>
                    </Box>
                  </Box>
                  {(data.content_type == 'quote' ||
                    data.content_type == 'review') && (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderLeft: '4px solid',
                        borderLeftColor: 'primary.main',
                        bgcolor: 'action.hover',
                        fontStyle: 'italic',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: 'pre-wrap', lineHeight: 'relaxed' }}
                      >
                        {data.text}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </>
  );
};
