module.exports = options => {
  const Sentry = options.Sentry;
  return {
    error: (consoleMsg, error) => {
      if (Sentry) {
        Sentry.captureException(error);
      }
      console.log(consoleMsg);
    }
  };
};
