import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import { postReadingList, postRecommendations } from '../services/api/books';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BookIcon from '@mui/icons-material/Book';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

export const Book = () => {
  const { selectedBook } = useContext(UserContext);
  const navigate = useNavigate();

  const handleBookReadList = async (book) => {
    try {
      const saveBook = await postReadingList(book.book_id);
      alert(`"${book.title}": ${saveBook['message']}`);
    } catch {
      alert('Error! Book already registered');
    }
  };

  const handleRecommendations = async (book) => {
    try {
      const saveBook = await postRecommendations(book.book_id);
      alert(`"${book.title}": ${saveBook['message']}`);
    } catch {
      alert('Error! Book already registered');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!selectedBook) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ height: 100 }} />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', maxWidth: 700 }}>
          <Box sx={{ display: 'flex', justifyContent: 'end', pr: 5 }}>
            <Box>
              <img
                width="200px"
                height="300px"
                src={selectedBook.image}
                alt="Book cover"
              />
            </Box>
          </Box>
          <Box sx={{ maxWidth: 450 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h3" sx={{ mb: 1 }}>
                {selectedBook.title}
              </Typography>
              {selectedBook.author[0] != 'N/A' && (
                <Typography sx={{ mb: 1 }}>by {selectedBook.author}</Typography>
              )}
              {selectedBook.published_date != 'N/A' && (
                <Typography sx={{ mb: 3 }}>
                  Published: {selectedBook.published_date}
                </Typography>
              )}
              {selectedBook.description != 'N/A' && (
                <Box
                  sx={{
                    mb: 3,
                    overflowY: 'auto',
                    width: 400,
                    maxHeight: 450,
                    border: '1px solid var(--border)',
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <Typography>{selectedBook.description}</Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Button
                  sx={{
                    background: 'var(--chart-0)',
                    '&:hover': { bgcolor: 'var(--chart-2)' },
                  }}
                  variant="contained"
                  onClick={() => handleBookReadList(selectedBook)}
                  startIcon={<AutoStoriesIcon />}
                >
                  Want to Read
                </Button>
              </Box>
              <Box sx={{ mb: 4 }}>
                <Button
                  sx={{
                    background: 'var(--chart-0)',
                    '&:hover': { bgcolor: 'var(--chart-2)' },
                  }}
                  variant="contained"
                  onClick={() => handleRecommendations(selectedBook)}
                  startIcon={<BookIcon />}
                >
                  Read
                </Button>
              </Box>

              <ArrowBackOutlinedIcon
                className="clickable-item"
                sx={{
                  bgcolor: 'var(--secondary)',
                  '&:hover': { bgcolor: 'var(--muted-foreground)' },
                  borderRadius: 2,
                }}
                fontSize="large"
                onClick={handleGoBack}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
