import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js'

const authenticate = async(req, res, next) => {
    try{
        const token = req.cookie.token;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const rootUser = await User.findOne({_id:verifyToken._id, 'tokens.token' : token});
        if(!rootUser){
            throw new Error('User not found')
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();

    }catch(err){
        res.status(401).send('Unauthorized')
        console.log({message : err})
    }
}

export default authenticate;