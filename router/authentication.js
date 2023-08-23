import express from 'express'
const router = express.Router();
import bcrypt from 'bcryptjs'
import User from '../models/userSchema.js'
import cookieParser from 'cookie-parser'
import authenticate from '../middleware/authenticate.js';
import secretToken from '../utils/secretToken.js'

router.use(cookieParser())

router.post('/register', async (req, res) => {

    const {name, email, type, password, cnfPassword} = req.body;

    if(!name || !email || !type || !password || !cnfPassword){
        res.status(422).json({error : "Fill the required fields"})
    }

    try {

        const userExist = await User.findOne({email : email});

        if (userExist) {
                res.status(422).json({error : "Email already exists"})
            } else if (password != cnfPassword){
                
                res.status(422).json({error : "Password mismatch"})
            } else {
                
            const userDetails = new User({name, email, type, password, cnfPassword});

            await userDetails.save();            
            
            res.status(201).json({message : "Registration Successful!"})
        
            }
            
        } catch(err){
        console.log(err)
    }
});

// login route

router.post('/login', async (req, res, next) => {
    
    try{

        const { email , password} = req.body;

        if(!email || !password) {
            res.status(400).json({error : "Enter required data"})
        }

        const loginDetails = await User.findOne({email : email});

        if(loginDetails){
            
        const isMatch = await bcrypt.compare(password, loginDetails.password);

        if(!isMatch){
            res.status(400).json({error : "Invalid Credentials"})
        }     
        const token = secretToken(loginDetails._id);
        res.cookie("token", token, {
          withCredentials: true,
          httpOnly: false,
        });
        res.status(201).json({ message: "User logged in successfully", success: true });
        next();
    }

    } catch (err){
        console.log(err)
    }
    
});


router.post('/', authenticate, (req, res)=> {
    res.send({message : "Login successful"})
});
router.post('/dashboard', authenticate, (req, res)=> {
    res.send({message : "authorised"})
});
router.post('/charts', authenticate, (req, res)=> {
    res.send({message : "authorised"})
});
router.post('/logs', authenticate, (req, res)=> {
    res.send({message : "authorised"})
});
router.post('/calendar', authenticate, (req, res)=> {
    res.send({message : "authorised"})
});

router.post('/logout', (req, res)=> {
    res.clearCookie('token', {path: '/login'})
    res.send("User Logged out")
})

export default router;