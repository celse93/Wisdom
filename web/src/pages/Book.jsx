import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { postBook } from '../services/api/books';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BookIcon from '@mui/icons-material/Book';

export const Book = () => {
  const { selectedBook, fetchUserFeed, fetchFeedData } =
    useContext(UserContext);

  const handleOnClick = async (e, book) => {
    const updatedBook = {
      ...book,
      type: e.target.id,
    };
    console.log(updatedBook);
    try {
      const saveBook = await postBook(updatedBook);
      alert(`${saveBook['message']}`);
      await Promise.all([fetchUserFeed(), fetchFeedData()]);
    } catch (error) {
      console.error('Error: ', error);
      alert('Error! Book already registered');
    }
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
      <Box sx={{ height: 50 }} />
      <Box sx={{ mt: 5, pt: 5, display: 'flex', justifyContent: 'center' }}>
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
                  id="reading"
                  sx={{
                    background: 'var(--chart-0)',
                    '&:hover': { bgcolor: 'var(--chart-2)' },
                  }}
                  variant="contained"
                  onClick={(e) => handleOnClick(e, selectedBook)}
                  startIcon={<AutoStoriesIcon />}
                >
                  Want to Read
                </Button>
              </Box>
              <Box sx={{ mb: 4 }}>
                <Button
                  id="recommendation"
                  sx={{
                    background: 'var(--chart-0)',
                    '&:hover': { bgcolor: 'var(--chart-2)' },
                  }}
                  variant="contained"
                  onClick={(e) => handleOnClick(e, selectedBook)}
                  startIcon={<BookIcon />}
                >
                  Read
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ height: 150 }} />
    </>
  );
};
