import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import { postReadingList, postRecommendations } from '../services/api/books';

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

  console.log(selectedBook);

  if (!selectedBook) {
    return <p>Cargando... </p>;
  }

  return (
    <div className="d-flex main-book-container justify-content-center mt-5 pt-5">
      <div className="d-flex book-container mt-3 mb-3">
        <div className="container book-cover-container d-flex justify-content-end pe-5">
          <div>
            <img
              src={selectedBook.cover}
              className="img-fluid"
              alt="Book cover"
            />
          </div>
        </div>
        <div className="container">
          <div>
            <h3>{selectedBook.title}</h3>
          </div>
          <div className="book-description overflow-scroll mb-3">
            <div className="mb-3">by {selectedBook.author}</div>
            <div className="mb-3">Published: {selectedBook.publish_year}</div>
            <p>{selectedBook.description}</p>
          </div>
          <div className="mt-auto mb-2">
            <button
              className="btn btn-primary btn-sm w-100"
              onClick={() => handleBookReadList(selectedBook)}
            >
              Want to Read
            </button>
          </div>
          <div className="mt-auto mb-4">
            <button
              className="btn btn-primary btn-sm w-100"
              onClick={() => handleRecommendations(selectedBook)}
            >
              Read
            </button>
          </div>
          <Link onClick={handleGoBack}>Return</Link>
        </div>
      </div>
    </div>
  );
};
