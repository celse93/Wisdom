import { useState, useContext } from 'react';
import { getBooksSearch, postBook } from '../services/api/books';
import { UserContext } from '../context/UserContext';
import { useParams } from 'react-router';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Modal,
  Select,
  TextareaAutosize,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { width } from '@mui/system';

export const CreatePosts = () => {
  const initialBookState = {
    title: '',
    author: [],
    publish_year: '',
    image: '',
    book_id: '',
    description: '',
  };
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [bookSelected, setBookSelected] = useState(initialBookState);
  const [selectedOption, setSelectedOption] = useState('reading');
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);
  const { fetchFeedData, fetchUserFeed, categories } = useContext(UserContext);
  let { profileId } = useParams();

  const handleSearch = async () => {
    if (!query.trim()) {
      alert('Error: Search query is empty.');
      return;
    }
    try {
      const result = await getBooksSearch(query);
      setBooks(result);
    } catch (error) {
      console.error(error);
      alert('Error searching book. Try again.');
      setBooks([]);
    }
  };

  const handleBookSelected = (book) => {
    setQuery(book.title);
    setBookSelected({
      ...bookSelected,
      title: book.title,
      author: book.author,
      publish_year: book.publish_year,
      image: book.image,
      book_id: book.book_id,
      description: book.description,
    });
    setBooks([]);
  };

  const handleSubmit = async (e) => {
    const updatedBook = {
      ...bookSelected,
      type: selectedOption,
      text: content,
      category_id: selectedCategory,
    };

    try {
      setOpen(false);
      const saveBook = await postBook(updatedBook);
      alert(`${saveBook['message']}`);
      await fetchUserFeed();
      await fetchFeedData();
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      setQuery('');
      setBooks([]);
      setContent('');
      setSelectedCategory(1);
      setSelectedOption('reading');
      setBookSelected(initialBookState);
    }
  };

  const handleOnChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleOnChangeCategory = (e) => {
    setSelectedCategory(e.target.value);
  };

  const showContent = selectedOption === 'quote' || selectedOption === 'review';

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setQuery('');
    setBooks([]);
    setContent('');
    setSelectedCategory(1);
    setSelectedOption('reading');
    setBookSelected(initialBookState);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <>
      <Button
        sx={{ background: 'var(--chart-0)', '&:hover': { bgcolor: 'var(--chart-2)' } }}
        startIcon={<AddIcon />}
        variant="contained"
        onClick={handleOpen}
      >
        Share Book
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          className="create-post"
          sx={{
            bgcolor: 'var(--background)',
            border: 1,
            borderColor: 'var(--border)',
            borderRadius: '15px',
            p: 4,
            width: '500px',
          }}
        >
          <FormControl sx={{ width: '400px' }}>
            <Typography
              sx={{ color: 'var(--text)', fontWeight: 'bold', mb: 1 }}
            >
              What would you like to share?{' '}
            </Typography>
            <Select
              onChange={handleOnChange}
              value={selectedOption}
              labelId="options"
              sx={{ width: '200px' }}
            >
              <MenuItem value={'reading'}>Want to Read</MenuItem>
              <MenuItem value={'recommendation'}>Book I've Read</MenuItem>
              <MenuItem value={'quote'}>Favorite Quote</MenuItem>
              <MenuItem value={'review'}>Book Review</MenuItem>
            </Select>
            <Box
              sx={{
                mt: 2,
                height: '100px',
                alignContent: 'center',
              }}
            >
              <Box sx={{ maxHeight: '60px' }}>
                <TextField
                  sx={{
                    color: 'var(--text)',
                    width: '330px',
                    height: '55px',
                    mr: 0.5,
                  }}
                  type="search"
                  required
                  label="Search book by title or author"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                />
                <Button
                  sx={{ height: '55px', bgcolor: 'var(--secondary)' }}
                  onClick={handleSearch}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </Button>
              </Box>
            </Box>
            <Box>
              {books.length > 0 && (
                <List>
                  {books.map((book) => (
                    <ListItem key={book.book_id} sx={{ display: 'flex' }}>
                      <Button
                        onClick={() => handleBookSelected(book)}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <img
                          src={book.image}
                          className="me-3"
                          style={{
                            width: '40px',
                            height: '60px',
                            objectFit: 'cover',
                          }}
                        />
                        <Box>
                          <Typography sx={{ mb: 1 }}>{book.title}</Typography>
                          <Typography>{book.author}</Typography>
                        </Box>
                      </Button>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            <Box sx={{ mt: 2 }}>
              {showContent && (
                <>
                  <Box sx={{ display: 'flex' }}>
                    {selectedOption == 'quote' && categories.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
                          Select a category:
                        </Typography>
                        <Select
                          onChange={handleOnChangeCategory}
                          value={selectedCategory}
                          MenuProps={MenuProps}
                        >
                          {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                              {category.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
                      {selectedOption == 'quote' ? 'Quote*' : 'Your Review*'}
                    </Typography>
                    <TextField
                      placeholder={
                        selectedOption == 'quote'
                          ? 'Enter your favorite quote from this book...'
                          : 'Share your thoughts about this book...'
                      }
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      sx={{ width: '400px' }}
                      multiline
                      rows={4}
                      required
                    />
                  </Box>
                </>
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                onClick={() => handleSubmit()}
                variant="contained"
                size="medium"
                sx={{
                  bgcolor: 'var(--chart-0)',
                  color: 'var(--background)',
                  '&:hover': { bgcolor: 'var(--chart-2)' },
                }}
              >
                Submit
              </Button>
            </Box>
          </FormControl>
        </Box>
      </Modal>
    </>
  );
};
