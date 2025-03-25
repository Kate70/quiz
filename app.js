const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const quizRoutes = require('./routes/quizRoutes');
dotenv.config({ path: './config.env' });

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use(cors());

app.use('/api', quizRoutes); 

mongoose.connect(process.env.MONGO_CONNECTION).then(() => {
    console.log("connected");
       
}).catch(() => {
    console.error
    
})



module.exports = app;
