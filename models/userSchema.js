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

userSchema.pre('save', async function (){
        this.password = await bcrypt.hash(this.password, 12)
        this.cnfPassword = await bcrypt.hash(this.cnfPassword, 12)
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY);
    return token;
};

const User = mongoose.model('USER', userSchema);

export default User