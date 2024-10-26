import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import quoteRoutes from './routes/quotes.js';
import entryRoutes from './routes/entries.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"]
}));
mongoose.connect(process.env.MONGO_URI,{
    dbName: "HackCLT"
})
.then(console.log("Connected to MongoDB"))
.catch((error) => console.log("Error connecting to database " + error));
app.use('/api/auth', authRoutes);
app.use('/api', quoteRoutes);
app.use('/api', entryRoutes);



const PORT = process.env.PORT;

app.listen(PORT || 3000, () =>{
    console.log('listening on port ' + PORT);
})