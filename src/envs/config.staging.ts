export default {
  ENVIRONMENT: 'staging',
  JWT_SECRET_KEY: 'VZEB64KASOf20splwZKPrqPay4oY9kJg',
  DATABASE_CONFIG: {
    mysql: {
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'need_notes',
    },
    mongodb: {
      host: 'localhost',
      port: 27017,
      username: 'root',
      password: 'password',
      database: 'need_notes',
    },
  },
  MAILER_OPTIONS: {
    host: 'your_host',
    port: 'your_port',
    auth: {
      user: 'your_user',
      pass: 'your_pass',
    },
  },
  AWS_CONFIG: {
    AWS_ACCESS_KEY_ID: 'your_access_key_id',
    AWS_SECRET_ACCESS_KEY: 'your_secret_access_key',
    AWS_S3_BUCKET_NAME: 'your_bucket_name',
  },
  GCP_CONFIG: {
    GCP_PROJECT_ID: 'your_project_id',
    GCP_CLIENT_EMAIL: 'your_client_email',
    GCP_PRIVATE_KEY: 'your_private_key',
    GCP_BUCKET_NAME: 'your_bucket_name',
  },
};
