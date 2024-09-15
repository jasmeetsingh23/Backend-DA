import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import colors from 'colors';
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/documents', documentRoutes);
app.use('/uploads', express.static('uploads'));

//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Document App</h1>");
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgCyan.white);
});
