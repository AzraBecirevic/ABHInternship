export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 16;

export const ENDPOINT =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_ENDPOINT_DEVELOP
    : process.env.REACT_APP_API_ENDPOINT_PRODUCTION;

export const PORT =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_PORT_DEVELOP
    : process.env.REACT_APP_API_PORT_PRODUCTION;
