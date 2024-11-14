const express = require('express');
const apiRouter = express.Router();
const tripsDAO = require('../db/tripsDAO');
const cookieParser = require('cookie-parser');
apiRouter.use(express.json());
apiRouter.use(cookieParser());


const { TokenMiddleware } = require('../middleware/TokenMiddleware');

apiRouter.get('/trips', (req, res) => {
    tripsDAO.getTrips().then(trips => {
        res.json(trips);
    });
});


apiRouter.get('/trips/user', TokenMiddleware, (req, res) => {
    //const idParam = req.params.userId;
    tripsDAO.getUserTrips(req.user.id).then(trips => {
        res.json(trips);
    }).catch(() => {
        res.status(404).json({ error: 'Trip not found' });
    });;
});

apiRouter.get('/trips/:name', TokenMiddleware, (req, res) => {
    //const idParam = req.params.userId;
    tripsDAO.getTripWithRecordsByName(req.params.name).then(trips => {
        let trip = {
            trip: trips
        }
        res.json(trip);
    }).catch(() => {
        res.status(404).json({ error: 'Trip not found' });
    });;
});

apiRouter.post('/trips', TokenMiddleware, (req, res) => {
    let newTrip = req.body;
    tripsDAO.createTrip(newTrip, req.user).then(trip => {
        res.json(trip);
    }).catch(err => {
        console.log(err);
        res.status(404).json({ error: 'Trip cannot be created' });
    });
});

apiRouter.put('/trips', TokenMiddleware, (req, res) => {
    let newTripInfo = req.body;
    tripsDAO.updateTrip(newTripInfo, req.user).then(trip => {
        res.json(trip);
    }).catch(err => {
        console.log(err);
        res.status(404).json({error: 'Trip cannot be updated'});
    });
});

apiRouter.delete('/trips', TokenMiddleware, (req, res) => {
    let tripname = req.body.name;
    tripsDAO.deleteTrip(tripname).then(resp => {
        res.json(resp);
    }).catch(err => {
        res.status(400).json({ error: 'Error Deleting trip' });
    });
});

module.exports = apiRouter;