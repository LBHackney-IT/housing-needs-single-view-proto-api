const logger = require('../lib/logger');

describe('Logger', () => {
  let Sentry;

  const createLogger = () => {
    Sentry = {
      captureException: jest.fn(()=>{})
    };

    return logger({Sentry})
  };

  let consoleOutput;

  beforeEach(() => {
    consoleOutput = '';
    const storeLog = inputs => (consoleOutput += inputs);
    console['log'] = jest.fn(storeLog);
  });

  it('does not call sentry in test env just logs error message', async () => {
    const logger = createLogger();
    const message = 'test';
    const error = new Error;

    logger.error(message, error);

    expect(consoleOutput).toStrictEqual(message);
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('calls sentry and logs error message in production', async () => {
    process.env.ENV = 'production';

    const logger = createLogger();
    const message = 'production test';
    const error = new Error;

    logger.error(message, error);

    expect(consoleOutput).toStrictEqual(message);
    expect(Sentry.captureException).toHaveBeenCalledWith(error);
  });

  it('calls sentry and logs error message in staging', async () => {
    process.env.ENV = 'staging';

    const logger = createLogger();
    const message = 'staging test';
    const error = new Error;

    logger.error(message, error);

    expect(consoleOutput).toStrictEqual(message);
    expect(Sentry.captureException).toHaveBeenCalledWith(error);
  });

});
