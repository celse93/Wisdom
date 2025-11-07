import { useNavigate } from 'react-router';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
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
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import StarIcon from '@mui/icons-material/Star';
import BookIcon from '@mui/icons-material/Book';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams } from 'react-router';
import { deleteBook } from '../services/api/books';

export const FeedCard = ({ bookInfo, data, profile }) => {
  const navigate = useNavigate();
  const { selectBook, fetchUserFeed } = useContext(UserContext);
  let { profileId } = useParams();

  const handleBookClick = async (book) => {
    const fetchBook = await selectBook(book);
    if (fetchBook) {
      navigate('/book');
    } else {
      console.log('Could not navigate to book page');
    }
  };

  const totalDays = (date) => {
    const daysMilisec = new Date(
      new Date().getTime() - new Date(date).getTime()
    );
    const daysNumber = daysMilisec.getDate() - 1;
    return daysNumber;
  };

  const handleDeleteClick = async (data) => {
    const book = {
      book_id: data.book_id,
      type: data.content_type,
      text: data.text,
    };
    await deleteBook(book);
    await fetchUserFeed();
  };

  return (
    <Box>
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
      >
        <CardHeader
          avatar={
            <Link
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
                <Typography variant="subtitle1" fontWeight="bold">
                  {profile.username}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--primary)' }}>
                  {totalDays(data.created_at) === 0
                    ? 'today'
                    : totalDays(data.created_at) === 1
                      ? totalDays(data.created_at) + ' day ago'
                      : totalDays(data.created_at) + ' days ago'}
                </Typography>
              </Box>
            </Link>
          }
          action={
            <Chip
              size="small"
              icon={
                data.content_type === 'quote' ? (
                  <FormatQuoteIcon
                    sx={{
                      color: 'var(--chart-1)',
                    }}
                  />
                ) : data.content_type === 'review' ? (
                  <StarIcon
                    sx={{
                      color: 'var(--chart-1)',
                    }}
                  />
                ) : data.content_type === 'reading' ? (
                  <BookIcon
                    sx={{
                      color: 'var(--chart-1)',
                    }}
                  />
                ) : (
                  <AutoStoriesIcon
                    sx={{
                      color: 'var(--chart-1)',
                    }}
                  />
                )
              }
              label={
                data.content_type === 'quote'
                  ? 'Quote'
                  : data.content_type === 'review'
                    ? 'Review'
                    : data.content_type === 'reading'
                      ? 'Want to Read'
                      : 'Read'
              }
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
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            <Box
              sx={{ flexShrink: 0 }}
              onClick={() => handleBookClick(bookInfo)}
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
                  bookInfo.image != ''
                    ? bookInfo.image
                    : 'https://imageplaceholder.net/300x300/eeeeee/131313?text=No+Cover'
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
                  fontStyle: 'italic',
                }}
              >
                {bookInfo.title}
              </Typography>
              <Typography
                variant="subtitle2"
                component="h3"
                sx={{ lineHeight: 'tight' }}
              >
                by {bookInfo.author}
              </Typography>
            </Box>
            {profile.id == profileId && (
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <DeleteIcon
                  className="clickable-item"
                  onClick={() => handleDeleteClick(data)}
                />
              </Box>
            )}
          </Box>
          {(data.content_type == 'quote' || data.content_type == 'review') && (
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
    </Box>
  );
};
