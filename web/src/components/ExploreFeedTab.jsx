import { getBooksDetail } from '../services/api/books';
import { useNavigate } from 'react-router';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
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
  Tab,
} from '@mui/material';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import StarIcon from '@mui/icons-material/Star';
import BookIcon from '@mui/icons-material/Book';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';

export const ExploreFeedTab = () => {
  const [bookDetails, setBookDetails] = useState([]);
  const [profileNames, setProfileNames] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [readingLists, setReadingLists] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const navigate = useNavigate();
  const { selectBook, feedData, fetchFeedData, isLoadingFeed } = useContext(UserContext);
  const [valueTabs, setValueTabs] = useState('recommendations');

  useEffect(() => {
    const initialLoad = async () => {
      await fetchFeedData();
    };
    initialLoad();
  }, []);

  useEffect(() => {
    const fetchBookCovers = async () => {
      if (feedData.length === 0) {
        return;
      }
      try {
        const dataRecommendations = feedData.filter(
          (value) => value.content_type === 'recommendation'
        );
        const dataReadingList = feedData.filter(
          (value) => value.content_type === 'reading_list'
        );
        const dataQuotes = feedData.filter(
          (value) => value.content_type === 'quote'
        );
        const dataReviews = feedData.filter(
          (value) => value.content_type === 'review'
        );

        const bookDetailPromises = feedData.map((book) =>
          getBooksDetail(book.book_id)
        );
        const [bookDetailsResult, profileDetailsResult] = await Promise.all([
          Promise.all(bookDetailPromises),
          getProfileNames(),
        ]);
        setBookDetails(bookDetailsResult);
        setProfileNames(profileDetailsResult);
        setRecommendations(dataRecommendations);
        setReadingLists(dataReadingList);
        setQuotes(dataQuotes);
        setReviews(dataReviews);
      } catch (error) {
        console.error('Failed to fetch book details:', error);
      }
    };
    fetchBookCovers();
  }, [feedData]);

  console.log(feedData);

  const handleBookClick = async (bookId) => {
    const fetchBook = await selectBook(bookId);
    if (fetchBook) {
      navigate('/book');
    } else {
      console.log('Could not navigate to book page');
    }
  };

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
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                              }}
                            >
                              <Avatar
                                alt="icon"
                                sx={{
                                  width: 40,
                                  height: 40,
                                  color: 'var(--primary)',
                                }}
                              >
                                <AutoStoriesRoundedIcon />
                              </Avatar>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                >
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
                              icon={
                                <AutoStoriesIcon
                                  sx={{
                                    color: 'var(--chart-1)',
                                  }}
                                />
                              }
                              label={'Read'}
                              sx={{
                                bgcolor: 'var(--background)',
                                color: 'var(--text)',
                                borderColor: 'var(--border)',
                                fontWeight: 'medium',
                                border: '1px solid',
                              }}
                            />
                          }
                          sx={{ paddingBottom: 0, paddingRight: 3 }}
                        />
                        <CardContent
                          sx={{
                            paddingTop: 0,
                            paddingBottom: '16px !important',
                          }}
                        >
                          <Box
                            sx={{ display: 'flex', gap: 2, marginBottom: 2 }}
                          >
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
                                  bookInfo.cover_id !== ''
                                    ? `https://covers.openlibrary.org/b/id/${bookInfo.cover_id}-M.jpg`
                                    : 'https://imageplaceholder.net/300x300/eeeeee/131313?text=sin+portada+de+libro'
                                }
                              />
                            </Box>
                            <Box sx={{ flexGrow: 1, paddingTop: 1 }}>
                              <Typography
                                variant="h6"
                                component="h3"
                                sx={{
                                  fontWeight: 'semibold',
                                  lineHeight: 'tight',
                                }}
                              >
                                {bookInfo.title}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
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
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                              }}
                            >
                              <Avatar
                                alt="icon"
                                sx={{
                                  width: 40,
                                  height: 40,
                                  color: 'var(--primary)',
                                }}
                              >
                                <AutoStoriesRoundedIcon />
                              </Avatar>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                >
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
                              icon={
                                <BookIcon
                                  sx={{
                                    color: 'var(--chart-1)',
                                  }}
                                />
                              }
                              label={'Want to Read'}
                              sx={{
                                bgcolor: 'var(--background)',
                                color: 'var(--text)',
                                borderColor: 'var(--border)',
                                fontWeight: 'medium',
                                border: '1px solid',
                              }}
                            />
                          }
                          sx={{ paddingBottom: 0, paddingRight: 3 }}
                        />
                        <CardContent
                          sx={{
                            paddingTop: 0,
                            paddingBottom: '16px !important',
                          }}
                        >
                          <Box
                            sx={{ display: 'flex', gap: 2, marginBottom: 2 }}
                          >
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
                                sx={{
                                  fontWeight: 'semibold',
                                  lineHeight: 'tight',
                                }}
                              >
                                {bookInfo.title}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
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
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                              }}
                            >
                              <Avatar
                                alt="icon"
                                sx={{
                                  width: 40,
                                  height: 40,
                                  color: 'var(--primary)',
                                }}
                              >
                                <AutoStoriesRoundedIcon />
                              </Avatar>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                >
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
                              icon={
                                <StarIcon
                                  sx={{
                                    color: 'var(--chart-1)',
                                  }}
                                />
                              }
                              label={'Review'}
                              sx={{
                                bgcolor: 'var(--background)',
                                color: 'var(--text)',
                                borderColor: 'var(--border)',
                                fontWeight: 'medium',
                                border: '1px solid',
                              }}
                            />
                          }
                          sx={{ paddingBottom: 0, paddingRight: 3 }}
                        />
                        <CardContent
                          sx={{
                            paddingTop: 0,
                            paddingBottom: '16px !important',
                          }}
                        >
                          <Box
                            sx={{ display: 'flex', gap: 2, marginBottom: 2 }}
                          >
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
                                sx={{
                                  fontWeight: 'semibold',
                                  lineHeight: 'tight',
                                }}
                              >
                                {bookInfo.title}
                              </Typography>
                            </Box>
                          </Box>
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
                              sx={{
                                whiteSpace: 'pre-wrap',
                                lineHeight: 'relaxed',
                              }}
                            >
                              {data.text}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
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
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                              }}
                            >
                              <Avatar
                                alt="icon"
                                sx={{
                                  width: 40,
                                  height: 40,
                                  color: 'var(--primary)',
                                }}
                              >
                                <AutoStoriesRoundedIcon />
                              </Avatar>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                >
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
                              icon={
                                <FormatQuoteIcon
                                  sx={{
                                    color: 'var(--chart-1)',
                                  }}
                                />
                              }
                              label={'Quote'}
                              sx={{
                                bgcolor: 'var(--background)',
                                color: 'var(--text)',
                                borderColor: 'var(--border)',
                                fontWeight: 'medium',
                                border: '1px solid',
                              }}
                            />
                          }
                          sx={{ paddingBottom: 0, paddingRight: 3 }}
                        />
                        <CardContent
                          sx={{
                            paddingTop: 0,
                            paddingBottom: '16px !important',
                          }}
                        >
                          <Box
                            sx={{ display: 'flex', gap: 2, marginBottom: 2 }}
                          >
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
                                sx={{
                                  fontWeight: 'semibold',
                                  lineHeight: 'tight',
                                }}
                              >
                                {bookInfo.title}
                              </Typography>
                            </Box>
                          </Box>
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
                              sx={{
                                whiteSpace: 'pre-wrap',
                                lineHeight: 'relaxed',
                              }}
                            >
                              {data.text}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
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
