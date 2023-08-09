import express from 'express';
import Event from './Event.js';
import moment from 'moment';

const router = express.Router();

router.post('/add-event', async(req, res)=>{
    const event = Event(req.body)
    await event.save();
    res.sendStatus(201);
})

router.get('/view-event', async (req, res)=>{
    const events = await Event.find({
        start: {$gte: moment(req.query.start).toDate()},
        end: {$lte: moment(req.query.end).toDate()}
    }) ;
    res.send(events)
})

export default router;