const logger = require('../lib/logger');

describe('Logger', () => {
  let Sentry;

  const createLogger = (sendSentry) => {
    Sentry = {
      captureException: jest.fn(()=>{})
    };

    return logger(
      sendSentry ? {Sentry} : {}
    )
  };

  let consoleOutput;

  beforeEach(() => {
    consoleOutput = '';
    const storeLog = inputs => (consoleOutput += inputs);
    console['log'] = jest.fn(storeLog);
  });

  it('does not call sentry in test env just logs error message', async () => {
    const logger = createLogger(false);
    const message = 'test';
    const error = new Error;

    logger.error(message, error);

    expect(consoleOutput).toStrictEqual(message);
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('calls sentry and logs error message when sentry is defined', async () => {
    const logger = createLogger(true);
    const message = 'production test';
    const error = new Error;

    logger.error(message, error);

    expect(consoleOutput).toStrictEqual(message);
    expect(Sentry.captureException).toHaveBeenCalledWith(error);
  });

});
