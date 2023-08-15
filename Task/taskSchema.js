import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    title : String,
    content : String,
    user : String,
    status : String,
    completion: Number
})

const Task = mongoose.model('TASK', taskSchema);

export default Task