export const API_BASE_URL = 'http://localhost:3000/api';

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/authenticate/login`,
  REGISTER: `${API_BASE_URL}/authenticate/register`
};

export const BOOK_ENDPOINTS = {
  BOOK: `${API_BASE_URL}/books`,
  GOOGLE: `${API_BASE_URL}/books/google/`
};
