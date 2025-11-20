export const baseUrl = '/api/';

export const usersUrl = 'users/';

export const fetchWrapper = async (input, init) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
  };

  const csrfToken = sessionStorage.getItem('csrf_access_token');
  if (csrfToken && !input.includes('/register')) {
    headers['X-CSRF-TOKEN'] = csrfToken;
  }

  return await fetch(input, {
    ...init,
    headers,
    credentials: 'include',
  })
    .then((response) => {
      if (response.status === 404) {
        return [];
      }
      if (response.ok) {
        return response.json();
      }
      if (response.status === 400) {
        return response.json().then((errorData) => {
          throw new Error(errorData.error || 'Bad Request');
        });
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error('Fetch error:', error);
      throw error;
    });
};
