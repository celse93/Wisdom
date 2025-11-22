import { baseUrl, fetchWrapper } from './config';

export const getBooksSearch = async (input) => {
  if (input == '') return console.error('No query!');
  return await fetchWrapper(`${baseUrl}books_search/volumes?q=${input}`, {
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

export const getAllCategories = async () => {
  return await fetchWrapper(`${baseUrl}categories`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

