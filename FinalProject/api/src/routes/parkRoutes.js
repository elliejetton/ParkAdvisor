const express = require('express');
const apiRouter = express.Router();
const parksDAO = require('../db/parksDAO');

const { TokenMiddleware } = require('../middleware/TokenMiddleware');


apiRouter.get('/parks/:parkName', TokenMiddleware,  (req, res) => {
    const nameParam = req.params.parkName;
    parksDAO.getParkByName(nameParam).then(park => {
        res.json(park);
    }).catch(() => {
        res.status(404).json({ error: 'Park not found' });
    });
});
apiRouter.get('/parks/:parkId', TokenMiddleware,  (req, res) => {
    const idParam = req.params.parkId;
    parksDAO.getParkById(idParam).then(park => {
        res.json(park);
    }).catch(() => {
        res.status(404).json({ error: 'Park not found' });
    });
});


apiRouter.get('/parks', (req, res) => {
    parksDAO.getParks().then(parks => {
        res.json(parks);
    });
});


module.exports = apiRouter;