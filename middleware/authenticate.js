import User from '../models/userSchema.js';
import dotenv from 'dotenv';
dotenv.config({path : './.env'});
import jwt from 'jsonwebtoken';

const authenticate = (req, res) => {
  const token = req.cookies.token
  if (!token) {
    return res.json({ status: false })
  }
  jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
     return res.json({ status: false })
    } else {
      const user = await User.findById(data._id)
      if (user) return res.json({ status: true, user: user.name })
      else return res.json({ status: false })
    }
  })
}

export default authenticate;