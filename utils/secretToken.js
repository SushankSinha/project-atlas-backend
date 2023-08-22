import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
dotenv.config({path : './.env'});

const secretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

export default secretToken;