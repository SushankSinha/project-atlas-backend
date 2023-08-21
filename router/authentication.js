import express from 'express'
const router = express.Router();
import bcrypt from 'bcryptjs'
import User from '../models/userSchema.js'
import cookieParser from 'cookie-parser'
// import authenticate from '../middleware/authenticate.js';
import jwt from 'jsonwebtoken';

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

router.post('/login', async (req, res) => {
    
    try{

        const { email , password} = req.body;

        if(!email || !password) {
            res.status(400).json({error : "Enter required data"})
        }

        const loginDetails = await User.findOne({email : email});

        if(loginDetails){
            
        const isMatch = await bcrypt.compare(password, loginDetails.password);

        // const token = jwt.sign({ id: loginDetails._id }, process.env.SECRET_KEY);

        if(!isMatch){
            res.status(400).json({error : "Invalid Credentials"})
        }else {
            res.send({ message: "Successfully Logged In"});
        }
        } else {
            res.status(400).json({error : "Invalid Credentials"})
        }

    } catch (err){
        console.log(err)
    }
    
});


router.get('/', (req, res)=> {
    res.send({message : "Login successful"})
});

router.get('/logout', (req, res)=> {
    res.clearCookie('token', {path: '/login'})
    res.send("User Logged out")
})

export default router;