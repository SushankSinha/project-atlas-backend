import express from 'express';
import Event from './Event.js';
import moment from "moment";

const router = express.Router();

router.get('/calendar/events',  async (req, res) => {

    try {
      const event = await Event.find({
        start : {$gte : moment(req.query.start).toDate()},
        end : {$lte : moment(req.query.end).toDate()},
      });
        res.send(event);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving Events' });
    }
  });

router.post('/calendar/add-event',  async(req, res)=>{
    const event = Event(req.body)
    await event.save();
    res.sendStatus(201);
})

router.put('/calendar/edit-event/:id',  async (req, res) => {

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

  router.delete('/calendar/delete/:id',  async (req, res) => {
    const id  = req.params.id;
  
    try {
      await Event.deleteOne({_id:id})
      res.status(204).json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting Event', error });
    }
  });

export default router;