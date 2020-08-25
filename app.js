const express = require('express')
const app = express()
const port = 3000
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// Importing routes
const authRoute = require('./Routes/auth');
const photoRoute = require('./Routes/photo');

dotenv.config();

// Connecting to DB
mongoose.connect(process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log('Conected to DB')
);

// Middelware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

//Route Middelware
app.use('/api/user', authRoute);
app.use('/api/photo', photoRoute);


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})