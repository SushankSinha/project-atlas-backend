import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    try{
        const token = req.header('x-auth-token');
        jwt.verify(token, process.env.SECRET_KEY);
        next();

    }catch(err){
        res.status(401).send('Unauthorized')
        res.send({message : err})
    }
}

export default authenticate;