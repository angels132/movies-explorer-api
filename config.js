require('dotenv').config();

const {
  NODE_ENV, PORT, JWT_SECRET, CONNECT,
} = process.env;

const config = {
  nodeEnv: NODE_ENV || 'development',
  port: PORT || 3000,
  jwtSecret: NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
  connectDb: CONNECT || 'mongodb://127.0.0.1:27017/bitfilmsdb',
};

module.exports = config;
