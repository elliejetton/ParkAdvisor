const express = require('express');

const app = express();
const PORT = process.env.PORT;

const routes = require('./routes/tripRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const parkRoutes = require('./routes/parkRoutes.js');

app.use(express.json());

app.use(routes);
app.use(userRoutes);
app.use(parkRoutes);
// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));