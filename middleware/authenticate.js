import dotenv from 'dotenv';
dotenv.config({path : './.env'});
import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.status(403).send("Access denied.");

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send("Invalid token");
    }
};

export default authenticate;