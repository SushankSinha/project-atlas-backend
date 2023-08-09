import express from 'express'
import Task from './taskSchema.js';

const router = express.Router();

// Route to get all Tasks

router.get('/task', async (req, res) => {

  try {
    const task = await Task.find();
    res.send(task);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving Tasks' });
  }
});

// Route to get one Task

router.get('/task/:id', async (req, res) => {
  const id = req.params._id;
  try {
    const task = await Task.findOne(id);
    res.send(task);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving Tasks' });
  }
});

// Route to add a new Task

router.post('/task/add-task', async (req, res) => {

  const {title, content, user} = req.body;

  if(!title || !content || !user){
      res.status(422).json({error : "Fill the required fields"})
  }else{

  try {
              
          const taskDetails = new Task({title, content, user});

          await taskDetails.save();            
          
          res.status(201).json({message : "Task Saved!"})
      
          } catch(err){
      console.log(err)
  }
}
});

router.put('/task/edit/:id', async (req, res) => {

  const id = req.params._id;

  const {title, content, user} = req.body;

  if(!title || !content || !user){
      res.status(400).json({error : "Fill the required fields"})
  }else{

    try {
      const updatedTask = await Task.findByIdAndUpdate(id, { title, content, user}, { new: true });
      res.status(201).json({message : "Task Updated!", task: updatedTask});
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating Task', error });
    }
}
});

router.delete('/task/delete/:id', async (req, res) => {
  const id  = req.params._id;

  try {
    await Task.findByIdAndDelete(id)
    res.status(204).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Task', error });
  }
});


export default router;