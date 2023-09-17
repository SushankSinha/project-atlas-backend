// import dotenv from 'dotenv';
// dotenv.config({path : './.env'});
// import jwt from 'jsonwebtoken';

// const authenticate = (req, res, next) => {
//     try {
//         const token = req.header("x-auth-token");
//         console.log(token);
//         if (!token) return res.status(403).send("Access denied.");

//         const tokenVerify = jwt.verify(token, process.env.SECRET_KEY);
//         console.log(tokenVerify);
//         req.user = tokenVerify;
//         next();
//     } catch (error) {
//         res.status(400).send("Invalid token");
//     }
// };

// export default authenticate;