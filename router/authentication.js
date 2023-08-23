import express from 'express'
const router = express.Router();
import bcrypt from 'bcryptjs'
import User from '../models/userSchema.js';
import authenticate from '../middleware/authenticate.js';
import secretToken from '../utils/secretToken.js'

router.post('/register', async (req, res) => {

    const {name, email, type, password, cnfPassword} = req.body;

    if(!name || !email || !type || !password || !cnfPassword){
        res.status(422).json({error : "Fill the required fields"})
    }

    try {

        const userExist = await User.findOne({email : email});

        if (userExist) {
            return res.status(422).json({message : "Email already exists"})
            } else if (password != cnfPassword){
                
               return res.status(422).json({error : "Password mismatch"})
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
          return res.status(400).json({error : "Enter required data"})
        }

        const loginDetails = await User.findOne({email : email});

        if(loginDetails){
            
        const isMatch = await bcrypt.compare(password, loginDetails.password);

        if(!isMatch){
           return res.status(400).json({error : "Invalid Credentials"})
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


router.post('/', authenticate);
router.post('/dashboard', authenticate);
router.post('/charts', authenticate);
router.post('/logs', authenticate);
router.post('/calendar', authenticate);

router.post('/logout', (req, res)=> {
    res.clearCookie('token', {path: '/login'})
    res.send("User Logged out")
})

export default router;