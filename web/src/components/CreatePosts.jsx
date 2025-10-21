import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import {
  getBooksSearch,
  postRecommendations,
  postReadingList,
  postReview,
} from '../services/api/books';
import { getAllCategories } from '../services/api/feed';
import { postQuote } from '../services/api/books';
import Modal from '@mui/material/Modal';
import { UserContext } from '../context/UserContext';

export const CreatePosts = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [bookSelected, setBookSelected] = useState({});
  const [selectedOption, setSelectedOption] = useState('reading');
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { fetchFeedData, fetchUserFeedData } = useContext(UserContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesList = await getAllCategories();
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };
    fetchCategories();
  }, []);

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
    setBookSelected(book);
    setBooks([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const dropdownElement = form.elements.options;
    const selectedValue = dropdownElement.value;

    try {
      if (selectedValue == 'review') {
        const saveReview = await postReview(
          bookSelected.book_id,
          content.trim()
        );
        alert(`${saveReview['message']}`);
      }

      if (selectedValue == 'quote') {
        const saveQuote = await postQuote(
          bookSelected.book_id,
          content.trim(),
          selectedCategory
        );
        alert(`${saveQuote['message']}`);
      }

      if (selectedValue == 'recommendation') {
        const saveRecommendation = await postRecommendations(
          bookSelected.book_id
        );
        alert(`${saveRecommendation['message']}`);
      }

      if (selectedValue == 'reading') {
        const saveReadingList = await postReadingList(bookSelected.book_id);
        alert(`${saveReadingList['message']}`);
      }
      setOpen(false);
      await fetchFeedData();
      await fetchUserFeedData();
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      setQuery('');
      setBooks([]);
      setContent('');
      setSelectedCategory(1);
      setSelectedOption('reading');
      setBookSelected({});
    }
  };

  const handleOnChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleOnChangeCategory = (e) => {
    setSelectedCategory(e.target.value);
  };

  const showContent = selectedOption == 'quote' || selectedOption == 'review';

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setQuery('');
    setBooks([]);
    setContent('');
    setSelectedCategory(1);
    setSelectedOption('reading');
    setBookSelected({});
  };

  return (
    <>
      <button onClick={handleOpen}>Share Book</button>
      <Modal open={open} onClose={handleClose}>
        <div className="post-modal">
          <h5>Share Your Reading Experience</h5>
          <form onSubmit={handleSubmit}>
            <label htmlFor="options">What would you like to share?</label>
            <select
              onChange={handleOnChange}
              value={selectedOption}
              name="options"
              id="options"
            >
              <option value="reading">Want to Read</option>
              <option value="recommendation">Book I've Read</option>
              <option value="quote">Favorite Quote</option>
              <option value="review">Book Review</option>
            </select>

            <div>
              <div>
                <label className="text-white">Search a book:</label>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Search by title or author"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                  />
                  <button onClick={handleSearch}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                </div>
                {books.length > 0 && (
                  <ul className="list-group mt-2">
                    {books.map((book) => (
                      <li
                        key={book.book_id}
                        className="list-group-item list-group-item-action d-flex"
                      >
                        <button
                          type="button"
                          onClick={() => handleBookSelected(book)}
                          className="dropdown-item d-flex align-items-center"
                        >
                          <img
                            src={`https://covers.openlibrary.org/b/id/${book.cover_id}-S.jpg`}
                            className="me-3"
                            style={{
                              width: '40px',
                              height: '60px',
                              objectFit: 'cover',
                            }}
                          />
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{book.title}</h6>
                            <small className="text-muted">{book.author}</small>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {showContent && (
              <>
                {selectedOption == 'quote' && categories.length > 0 && (
                  <div>
                    <label htmlFor="categories">Select category:</label>
                    <select
                      onChange={handleOnChangeCategory}
                      value={selectedCategory}
                      name="categories"
                      id="categories"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label htmlFor="content">
                    {selectedOption == 'quote' ? 'Quote *' : 'Your Review *'}
                  </label>
                  <textarea
                    id="content"
                    placeholder={
                      selectedOption == 'quote'
                        ? 'Enter your favorite quote from this book...'
                        : 'Share your thoughts about this book...'
                    }
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="5"
                    required
                  />
                </div>
              </>
            )}
            <button type="submit" value="Submit">
              Submit
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};
