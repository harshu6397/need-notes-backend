export default {
  ENVIRONMENT: 'production',
  DATABASE_URL: 'mysql://root:root@localhost:3306/we_want_more',
  JWT_SECRET_KEY: 'VZEB64KASOf20splwZKPrqPay4oY9kJg',
  STRIPE_SECRET_KEY: '',
  STRIPE_API_VERSION: '2023-10-16',
  STRIPE_WEBHOOK_SECRET: '',
  DATABASE_CONFIG: {
    mysql: {
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'need_notes',
    },
    mongodb: {
      uri: 'mongodb://localhost:27018/need_notes',
    },
  },
  MAILER_OPTIONS: {
    host: '',
    port: 2525,
    auth: {
      user: '',
      pass: '',
    },
  },
  AWS_CONFIG: {
    AWS_ACCESS_KEY_ID: '',
    AWS_SECRET_ACCESS_KEY: '',
    AWS_S3_BUCKET_NAME: '',
  },
  GCP_CONFIG: {
    GCP_PROJECT_ID: '',
    GCP_CLIENT_EMAIL: '',
    GCP_PRIVATE_KEY: '',
    GCP_BUCKET_NAME: '',
  },
};
