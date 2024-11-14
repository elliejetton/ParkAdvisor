const express = require('express');
const router = express.Router();

const html_dir = __dirname + '/templates/';

/** Routes */


//login page when users are not authenticated yet
router.get('/login', (req, res) => {
    res.sendFile(`${html_dir}login.html`);
   
});

//home page with map of parks and options to view or create a trip
router.get('/', (req, res) => {
    res.sendFile(`${html_dir}index.html`);
   
});

//page for users to create an account with a username and password
router.get('/createAccount', (req, res) => {
    res.sendFile(`${html_dir}createUser.html`);
    
});
// page to create a trip 
router.get('/trip', (req, res) => {
    res.sendFile(`${html_dir}addtrip.html`);
    
});
//page to view your existing trips
router.get('/yourtrips', (req, res) => {
    res.sendFile(`${html_dir}yourtrips.html`);
    
});
//user profile page
router.get('/profile', (req, res) => {
    res.sendFile(`${html_dir}profile.html`);
    
});
//Alert to users that they are offline
router.get('/offline', (req, res) => {
    res.sendFile(`${html_dir}offline.html`);
    
});

module.exports = router;