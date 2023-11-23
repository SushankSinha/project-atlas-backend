import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import User from '../models/userSchema.js';
import jwt from 'jsonwebtoken';

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
        res.cookie("token", token, {
            withCredentials: true,
            secure : true
          });

        res.status(200).json({ message: "Successfully Logged In", token : token, user : loginDetails._id });
            
        }
        } else {
            res.status(400).json({error : "Invalid Credentials"})
        }

    } catch (err){
        console.log(err)
    }
    
});

router.put("/reset_password/new_password", async (req, res) => {
  
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({ message: "User does not exists" });
    } else {
      try {
    const hash = await bcrypt.hash(password, 12);

    const auth = await User.findByIdAndUpdate(
      { _id: user.id },
      { $set: { password: hash } },
      { new: true }
    );
    if (auth) {
      res.status(201).json({ message: "Password updated successfully", success: true });
    }
   } catch (error) {
    console.error(error);
    }
  }
});

router.get('/', (req, res)=> {
    res.status(200).json({ message: 'Welcome to HomePage' });
});

router.get('/user/:id', async(req, res)=> {
    const id = req.params.id
    try{
    const user = await User.findOne({_id : id});
    if(user){
        res.status(200).json({user})
    }
    }catch(err){
        console.log(err)
    }
});

router.get('/dashboard', (req, res)=> {
    res.status(200).json({ message: 'Welcome to Dashboard' });
});
router.get('/charts', (req, res)=> {
    res.status(200).json({ message: 'Welcome to charts' });
});
router.get('/logs',  (req, res)=> {
    res.status(200).json({ message: 'Welcome to logs' });
});
router.get('/calendar',  (req, res)=> {
    res.status(200).json({ message: 'Welcome to calendar' });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged Out Successfully'});
  });

export default router;