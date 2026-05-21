const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

let accessToken = localStorage.getItem('accessToken') || null;

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

export const getAccessToken = () => accessToken;

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Inject Bearer token if available
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include', // Send cookies (refreshToken)
  };

  try {
    let response = await fetch(url, fetchOptions);

    // Handle Token Expiration / 401 Unauthorized
    if (response.status === 401 && accessToken && !options._retry) {
      options._retry = true;
      try {
        // Try to refresh token
        const refreshResponse = await fetch(`${BASE_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          const refreshResult = await refreshResponse.json();
          if (refreshResult.code === 1000 && refreshResult.result?.accessToken) {
            setAccessToken(refreshResult.result.accessToken);
            // Retry the original request with the new token
            headers['Authorization'] = `Bearer ${refreshResult.result.accessToken}`;
            response = await fetch(url, fetchOptions);
          } else {
            // Refresh token invalid, clear session
            setAccessToken(null);
            window.dispatchEvent(new Event('auth-expired'));
          }
        } else {
          setAccessToken(null);
          window.dispatchEvent(new Event('auth-expired'));
        }
      } catch (err) {
        setAccessToken(null);
        window.dispatchEvent(new Event('auth-expired'));
      }
    }

    // Parse JSON safely
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    // Check custom ApiResponse code (1000 is Success)
    if (data.code !== undefined && data.code !== 1000) {
      throw new Error(data.message || 'Có lỗi xảy ra');
    }

    return data.result !== undefined ? data.result : data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
