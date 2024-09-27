const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const path = require('path');
const session = require('express-session');
const sqlSession = require('./config/sqlSession');
const initS3Bucket = require('./helpers/initS3Bucket');

require('dotenv').config();



// Load routes
const vehicleSubmissionRoute = require('./routes/vehiclesubmission.js');

console.log(`Current version: ${process.version}`);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'tmp')));
app.use(cookieParser());

const corsOptions = {
  origin: process.env.APPLICATION_URL, // Can specify origin (aws s3 react-app link)
  optionsSuccessStatus: 200,
  credentials: true,
};


app.use(cors(corsOptions));

app.use(
  session({
    key: 'vehiclebidding_session_key',
    secret: 'vehiclebidding_session_secret',
    store: sqlSession,
    resave: false,
    saveUninitialized: false,
  })
);


app.use('/vehiclesubmission', vehicleSubmissionRoute);


// Local server (comment out before upload to aws)
app.listen(5000, async function () {
  await initS3Bucket();
});

module.exports = app;
