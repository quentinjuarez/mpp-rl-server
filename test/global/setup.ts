module.exports = () => {
  process.env = {
    NODE_ENV: "test",
    LOG_LEVEL: "silent",
    APP_ID: "mpp-rl-test",
    // others
    PORT: "secret",
    API_KEY: "secret",
    MONGODB_URI: "secret",
    FRONT_URL: "secret",
    BACK_URL: "secret",
    GOOGLE_CLIENT_ID: "secret",
    GOOGLE_CLIENT_SECRET: "secret",
    GOOGLE_REDIRECT_URI: "secret",
  };
};
