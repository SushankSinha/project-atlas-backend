import jwt from 'jsonwebtoken';
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    type : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    cnfPassword : {
        type : String,
        required : true
    }, tokens : [
        {
            token : {
                type : String,
                required : true
            }
        }
    ]
})

userSchema.pre('save', async function (next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12)
        this.cnfPassword = await bcrypt.hash(this.cnfPassword, 12)
    }
    next();
})

userSchema.methods.generateAuthToken = async function(){
    try {
        let token = jwt.sign({_id : this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token : token})
        await this.save();
        return token;
    } catch (err) {
        console.log(err)
    }
}

const User = mongoose.model('USER', userSchema);

export default User