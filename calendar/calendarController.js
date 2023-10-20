import express from 'express';
import Event from './Event.js';
import { authenticate } from '../router/authentication.js';

const router = express.Router();

router.get('/calendar', authenticate, async (req, res) => {

    try {
      const event = await Event.find();
      res.send(event);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving Events' });
    }
  });

    router.get('/calendar/:id', authenticate, async (req, res) => {
    const id  = req.params.id;
  
    try {
      const event = await Event.findOne({_id:id})
      res.send(event);
    } catch (error) {
      res.status(500).json({ message: 'Event Not Found', error });
    }
  });

router.post('/calendar/add-event', authenticate, async(req, res)=>{
    const event = Event(req.body)
    await event.save();
    res.send({message: 'Event Created'});
})

router.put('/calendar/edit-event/:id', authenticate, async (req, res) => {

    const id = req.params.id;

    const event = Event(req.body)
  
      try {

        const updatedEvent = await Event.updateOne({_id:id}, { $set : {title : event.title, start : event.start, end : event.end}}, {new : true} );
        
        if (!updatedEvent) {
          return res.status(404).json({ message: "Event not found" });
        }

        res.status(201).json({message : "Event Updated!"});

      } catch (error) {
        res.status(500).json({ message: 'Error updating Event', error });
      }
  });

  router.delete('/calendar/delete/:id', authenticate, async (req, res) => {
    const id  = req.params.id;
  
    try {
      await Event.deleteOne({_id:id})
      res.status(204).json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting Event', error });
    }
  });

export default router;