import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import User from '../models/userSchema.js';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

router.use(cookieParser());

router.post('/register', async (req, res) => {

    const {name, email, password} = req.body;

    try {

        const userExist = await User.findOne({email : email});

        if (userExist) {
                res.status(422).json({error : "Email already exists"})
            } else {
                
            const userDetails = new User({name, email, password});

            await userDetails.save();            
            
            res.status(201).json({message : "Registration Successful!"})
        
            }
            
        } catch(err){
        console.log(err)
    }
});

// login route

router.post('/login', async (req, res) => {
    
    try{

        const { email , password} = req.body;

        const loginDetails = await User.findOne({email : email});

        if(loginDetails){
            
        const isMatch = await bcrypt.compare(password, loginDetails.password);

        if(!isMatch){
            res.status(400).json({error : "Invalid Credentials"})
        }else {
        const token = jwt.sign({id: loginDetails._id}, process.env.SECRET_KEY, { expiresIn: '24h' });
        console.log(token);
        res.cookie('token', token, { httpOnly: true });

        res.send({ message: "Successfully Logged In", token : token });
            
        }
        } else {
            res.status(400).json({error : "Invalid Credentials"})
        }

    } catch (err){
        console.log(err)
    }
    
});

export const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      res.redirect('https://atlas-tool.netlify.app/login');
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.redirect('https://atlas-tool.netlify.app/login');
      }
      req.user = decoded;
      next();
    });
  };


router.get('/', authenticate, (req, res)=> {
    res.status(200).json({ message: 'Welcome to HomePage' });
});
router.get('/dashboard', authenticate, (req, res)=> {
    res.status(200).json({ message: 'Welcome to Dashboard' });
});
router.get('/charts', authenticate, (req, res)=> {
    res.status(200).json({ message: 'Welcome to charts' });
});
router.get('/logs', authenticate, (req, res)=> {
    res.status(200).json({ message: 'Welcome to logs' });
});
router.get('/calendar', authenticate, (req, res)=> {
    res.status(200).json({ message: 'Welcome to calendar' });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged Out Successfully' });
    res.redirect('/login');
  });

export default router;