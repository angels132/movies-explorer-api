const {
  NODE_ENV,
  SECRET_SIGNING_KEY,
  MONGODB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

module.exports = {
  NODE_ENV,
  SECRET_SIGNING_KEY,
  MONGODB_URL,
};
