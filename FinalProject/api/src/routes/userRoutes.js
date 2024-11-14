const express = require('express');
const userRouter = express.Router();
const usersDAO = require('../db/usersDAO');
const cookieParser = require('cookie-parser');
const { TokenMiddleware, generateToken, removeToken } = require('../middleware/TokenMiddleware');


userRouter.use(cookieParser());
userRouter.use(express.json());

userRouter.get('/user/active', TokenMiddleware, (req, res) => {
    res.json(req.user);
});

userRouter.post('/user/login', (req, res) => {
    if (req.body.username && req.body.password) {
        usersDAO.loginUser(req.body.username, req.body.password).then(resp => {
            let result = {
                user: resp
            }
            console.log(resp);
            generateToken(req, res, resp);
            console.log("I get here");
            res.json(result);
        }).catch(err => {
            console.log("1-----" + err);
            res.status(err.code).json({ error: err.message });
        });
    }
    else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

userRouter.post('/user/logout', (req, res) => {
    removeToken(req, res);
    res.json({ success: true });
});

userRouter.post('/user/create', async (req, res) => {
    if (req.body.username && req.body.password) {

        usersDAO.registerUser(req.body.username, req.body.password).then(result => {

            res.json(result);
        }).catch(err => {
            res.status(400).json({error: err});
        });

    }
    else {
        res.status(400).json({ error: 'Bad info' });
    }
});

module.exports = userRouter;