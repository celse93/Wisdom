import { baseUrl, fetchWrapper } from './config';

export const getUserRecommendations = async () => {
  return await fetchWrapper(`${baseUrl}recommendations/user`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getUserReadingLists = async () => {
  return await fetchWrapper(`${baseUrl}reading_list/user`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getUserQuotes = async () => {
  return await fetchWrapper(`${baseUrl}quotes/user`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getUserReviews = async () => {
  return await fetchWrapper(`${baseUrl}reviews/user`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getAllRecommendations = async () => {
  return await fetchWrapper(`${baseUrl}recommendations`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getAllReadingLists = async () => {
  return await fetchWrapper(`${baseUrl}reading_list`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getAllQuotes = async () => {
  return await fetchWrapper(`${baseUrl}quotes`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getAllReviews = async () => {
  return await fetchWrapper(`${baseUrl}reviews`, {
    credentials: 'include',
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

export const getFollowRecommendations = async (profileId) => {
  return await fetchWrapper(`${baseUrl}recommendations/follow/${profileId}`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getFollowReadingLists = async (profileId) => {
  return await fetchWrapper(`${baseUrl}reading_list/follow/${profileId}`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getFollowQuotes = async (profileId) => {
  return await fetchWrapper(`${baseUrl}quotes/follow/${profileId}`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getFollowReviews = async (profileId) => {
  return await fetchWrapper(`${baseUrl}reviews/follow//${profileId}`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};
