process.loadEnvFile(".env");

const { MONGO_URI, PORT } = process.env;

export const env = {
  MONGO_URI,
  PORT,
};
