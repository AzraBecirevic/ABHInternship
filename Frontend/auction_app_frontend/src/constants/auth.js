export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 16;

export const ENDPOINT =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_HOST + process.env.REACT_APP_API_PORT
    : process.env.REACT_APP_API_HOST;
