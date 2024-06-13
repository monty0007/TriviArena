const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser=require('body-parser')
// Import routes
const userRoutes = require('./routes/user');
const quizRouter = require("./routes/quiz");
const gameRouter = require("./routes/game");
dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());


const PORT = process.env.PORT || 5000;
 
app.listen(PORT, () => { 
    console.log(`Server Running on Port ${PORT}`);
});

const connectDB = async () => {  
    try {
        await mongoose.connect(process.env.MONGO_URL, {
        });
        console.log('Successfully connected to the database');
    } catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
};

connectDB();


app.use('/api/users', userRoutes);
app.use('/api/quizes', quizRouter);
app.use('/api/game',gameRouter);



