import { baseUrl, fetchWrapper } from './config';

export const getProfileNames = async () => {
  return await fetchWrapper(`${baseUrl}profiles`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getCurrentUser = async () => {
  return await fetchWrapper(`${baseUrl}me`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getCurrentProfile = async () => {
  return await fetchWrapper(`${baseUrl}profiles/user`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const updateProfile = async (username) => {
  if (username == '') return alert('No username');
  return await fetchWrapper(`${baseUrl}profiles/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      username: username,
    }),
  }).then((data) => {
    return data;
  });
};
