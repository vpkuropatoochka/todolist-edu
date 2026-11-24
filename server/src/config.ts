import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: required('DATABASE_URL'),
  apiToken: required('API_TOKEN'),
  userLogin: required('USER_LOGIN'),
  userFullName: required('USER_NAME'),
};
