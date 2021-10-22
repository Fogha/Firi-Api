require("dotenv").config();

const express = require('express');
const { MONGOURI } = require('./src/config/database');
const mongoose = require('mongoose');
const app = express();

console.log(process.env)

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

// Check connection
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB!');
});

// Check for DB errors
mongoose.connection.on('error', (err) => {
  console.log(err);
});

// routes
require('./src/models/user')
require('./src/models/business')

app.use(express.json())
app.use(require('./src/routes/authRoutes'))
app.use(require('./src/routes/userRoutes'))
app.use(require('./src/routes/businessRoutes'))

// Setting port and starting the nodejs server
const port = 8000;

app.listen(port, function () {
  console.log('Server started!');
});