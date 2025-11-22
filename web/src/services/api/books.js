import { baseUrl, fetchWrapper } from './config';

export const getBooksSearch = async (input) => {
  if (input == '') return console.error('No query!');
  return await fetchWrapper(`${baseUrl}books_search/volumes?q=${input}`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getBooksDetail = async (id) => {
  if (id == '') return console.error('No book ID!');
  return await fetchWrapper(`${baseUrl}book_detail/volumes/${id}`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getAllBooks = async () => {
  return await fetchWrapper(`${baseUrl}get_all`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getAllUserBooks = async () => {
  return await fetchWrapper(`${baseUrl}get_all_user`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getAllFollowBooks = async (profileId) => {
  return await fetchWrapper(`${baseUrl}get_all_follow/${profileId}`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const postReadingList = async (bookId) => {
  if (bookId == '') return alert('No book!');
  return await fetchWrapper(`${baseUrl}reading_list/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      book_id: bookId,
    }),
  }).then((data) => {
    return data;
  });
};

export const postRecommendations = async (bookId) => {
  if (bookId == '') return alert('No book!');
  return await fetchWrapper(`${baseUrl}recommendations/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      book_id: bookId,
    }),
  }).then((data) => {
    return data;
  });
};

export const postBook = async (book) => {
  if (book.book_id == '' || book.type == '') return alert('No book ID or type');
  return await fetchWrapper(`${baseUrl}posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      book_id: book.book_id,
      title: book.title,
      author: book.author,
      description: book.description,
      date: book.publish_year,
      image: book.image,
      type: book.type,
      text: book.text,
      category_id: book.category_id,
    }),
  }).then((data) => {
    return data;
  });
};

export const deleteBook = async (book) => {
  if (book.book_id == '' || book.type == '') return alert('No book ID or type');
  return await fetchWrapper(`${baseUrl}delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      book_id: book.book_id,
      type: book.type,
      text: book.text,
    }),
  }).then((data) => {
    return data;
  });
};

export const postQuote = async (bookId, text, categoryId) => {
  if (text == '' || bookId == '') return alert('Required fields empty!');
  return await fetchWrapper(`${baseUrl}quotes/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      book_id: bookId,
      text: text,
      category_id: categoryId,
    }),
  }).then((data) => {
    return data;
  });
};

export const postReview = async (bookId, text) => {
  if (text == '' || bookId == '') return alert('¡Rellena todos los campos!');
  return await fetchWrapper(`${baseUrl}reviews/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      book_id: bookId,
      text: text,
    }),
  }).then((data) => {
    return data;
  });
};

export const deleteReadingList = async (bookId) => {
  if (bookId == '') return alert('¡Sin libro!');
  return await fetchWrapper(`${baseUrl}reading_list/user`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      book_id: bookId,
    }),
  }).then((data) => {
    return data;
  });
};

export const deleteRecommendations = async (bookId) => {
  if (bookId == '') return alert('¡Sin libro!');
  return await fetchWrapper(`${baseUrl}recommendations/user`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      book_id: bookId,
    }),
  }).then((data) => {
    return data;
  });
};

export const deleteQuote = async (quoteId) => {
  if (quoteId == '') return alert('¡Sin cita!');
  return await fetchWrapper(`${baseUrl}quotes/user`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      quote_id: quoteId,
    }),
  }).then((data) => {
    return data;
  });
};

export const deleteReview = async (reviewId) => {
  if (reviewId == '') return alert('¡Sin reseña!');
  return await fetchWrapper(`${baseUrl}reviews/user`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      review_id: reviewId,
    }),
  }).then((data) => {
    return data;
  });
};
