import { useState, useContext } from 'react';
import { getBooksSearch, postBook } from '../services/api/books';
import { UserContext } from '../context/UserContext';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

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
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSearch = async (e) => {
    if (!query.trim()) {
      alert('Error: Search query is empty.');
      return;
    }
    try {
      const result = await getBooksSearch(query);
      setBooks(result);
      setAnchorEl(e.target);
    } catch (error) {
      console.error(error);
      alert('Error searching book. Try again.');
      setBooks([]);
      setAnchorEl(null);
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

  const handleSubmit = async () => {
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
    setAnchorEl(null);
  };

  const handleAuthors = (array) => {
    let authors = '';

    if (array.length == 1) return array[0];

    if (array.length > 1) {
      for (let i = 0; i < array.length; i++) {
        if (i == array.length - 1) {
          authors += array[i];
        } else {
          authors += array[i] + ', ';
        }
      }
      return authors;
    }
  };

  return (
    <>
      <Button
        sx={{
          background: 'var(--chart-0)',
          '&:hover': { bgcolor: 'var(--chart-2)' },
        }}
        startIcon={<AddCircleIcon />}
        variant="contained"
        onClick={handleOpen}
      >
        Share Book
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 550,
            bgcolor: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: '15px',
            boxShadow: 24,
            p: 5,
          }}
        >
          <Typography sx={{ color: 'var(--text)', fontWeight: 'bold', mb: 1 }}>
            What would you like to share?{' '}
          </Typography>
          <Select
            onChange={handleOnChange}
            value={selectedOption}
            labelId="options"
            sx={{ width: 200 }}
          >
            <MenuItem value={'reading'}>Want to Read</MenuItem>
            <MenuItem value={'recommendation'}>Book I've Read</MenuItem>
            <MenuItem value={'quote'}>Favorite Quote</MenuItem>
            <MenuItem value={'review'}>Book Review</MenuItem>
          </Select>
          {/* Section to search books */}
          <Box
            sx={{
              mt: 2,
              height: 100,
              alignContent: 'center',
            }}
          >
            <Box sx={{ maxHeight: 60 }}>
              <TextField
                sx={{
                  color: 'var(--text)',
                  width: 330,
                  height: 55,
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
                    handleSearch(e);
                  }
                }}
              />
              <Button
                sx={{
                  height: 55,
                  bgcolor: 'var(--secondary)',
                  '&:hover': { bgcolor: 'var(--muted-foreground)' },
                }}
                onClick={handleSearch}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </Button>
            </Box>
          </Box>
          {/* dropdown list of books searched */}
          {books.length > 0 && (
            <Box
              sx={{
                maxHeight: 300,
                overflowY: 'auto',
              }}
            >
              <List anchorEl={anchorEl}>
                {books.map((book) => (
                  <ListItem key={book.book_id} sx={{ display: 'flex' }}>
                    <ListItemButton
                      onClick={() => handleBookSelected(book)}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <img
                        src={book.image}
                        style={{
                          width: 40,
                          height: 60,
                          objectFit: 'cover',
                        }}
                      />
                      <Box sx={{ ml: 1 }}>
                        <Typography sx={{ mb: 1 }}>{book.title}</Typography>
                        {book.author[0] != 'N/A' && (
                          <Typography>
                            {`by ${handleAuthors(book.author)}`}
                          </Typography>
                        )}
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          {/* section to choose Quote's category */}
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
                {/* section to write Quote or Review */}
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
                    sx={{ width: 400 }}
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
              onClick={() => handleClose()}
              variant="outlined"
              size="medium"
              sx={{
                mr: 2,
                color: 'var(--chart-1)',
              }}
            >
              Cancel
            </Button>
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
        </Box>
      </Modal>
    </>
  );
};
