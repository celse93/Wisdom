import { baseUrl, fetchWrapper } from './config';

export const searchProfiles = async (query) => {
  if (!query) return [];
  return await fetchWrapper(`${baseUrl}profiles/search?q=${query}`, {
    credentials: 'include',
  });
};

export const followUser = async (userId) => {
  return await fetchWrapper(`${baseUrl}follows/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      user_id: userId,
    }),
  }).then((data) => {
    return data;
  });
};

export const unfollowUser = async (userId) => {
  return await fetchWrapper(`${baseUrl}follows/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      user_id: userId,
    }),
  }).then((data) => {
    return data;
  });
};

export const getFollowers = async () => {
  return await fetchWrapper(`${baseUrl}followers/`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getFollowings = async () => {
  return await fetchWrapper(`${baseUrl}followings/`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

