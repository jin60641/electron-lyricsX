import * as Sentry from '@sentry/browser';

const { REACT_APP_SENTRY_DSN: dsn, REACT_APP_ENVIRONMENT: environment } = process.env;

if (dsn && environment) {
  Sentry.init({
    dsn,
    environment,
  });
}
