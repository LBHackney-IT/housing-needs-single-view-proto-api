module.exports = options => {
  const Sentry = options.Sentry;
  return {
    error: (consoleMsg, error) => {
      if (process.env.ENV === 'staging' || process.env.ENV === 'production') {
        Sentry.captureException(error);
      }
      console.log(consoleMsg);
    }
  };
};
