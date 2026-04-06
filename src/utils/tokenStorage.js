const ACCESS_TOKEN_KEY = "accessToken";

const tokenStorage = {
  get: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  set: (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  remove: () => localStorage.removeItem(ACCESS_TOKEN_KEY),
};

export default tokenStorage;
