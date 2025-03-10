
export const Config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  WEB_CLIENT: process.env.WEB_CLIENT || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "00",
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    CALLBACK_URL:
      process.env.GOOGLE_CALLBACK_URL ||
      'http://localhost:300/v1/auth/google/callback',
  },
  X_TWITTER: {
    CLIENT_ID: process.env.X_TWITTER_CLIENT_ID,
    CLIENT_SECRET: process.env.X_TWITTER_CLIENT_SECRET,
    CALLBACK_URL:
      process.env.X_TWITTER_CALLBACK_URL ||
      'http://localhost:300/v1/auth/x-twitter/callback',
  },
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
};
