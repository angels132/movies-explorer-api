const {
  NODE_ENV,
  SECRET_SIGNING_KEY,
  MONGODB_URL,
} = process.env;

const EMAIL_REGEX = /.+@.+\..+/;
const PASSWORD_REGEX = /^(?=.*[A-z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;
const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

module.exports = {
  NODE_ENV,
  SECRET_SIGNING_KEY,
  MONGODB_URL,

  EMAIL_REGEX,
  PASSWORD_REGEX,
  URL_REGEX,
};
