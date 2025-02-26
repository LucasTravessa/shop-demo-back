/* eslint-disable no-console */
export const jwtConstants = {
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
    ? parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN, 10)
    : 60 * 60 * 24 * 7,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
    ? parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN, 10)
    : 60 * 60 * 24 * 30,
};

console.log(jwtConstants);
