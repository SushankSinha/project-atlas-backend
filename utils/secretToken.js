import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
dotenv.config({path : './.env'});

const secretToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

export default secretToken;