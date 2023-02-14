import express from 'express'
import path from 'path';
import dotenv from 'dotenv'
import { initializeDb } from './data/database';
import authRoutes from './routes/auth.routes'

initializeDb();
dotenv.config()
const port = 3000;
const viewsPath = path.join(__dirname, 'views')
const app = express();
app.set('view engine', 'ejs');
app.set('views', viewsPath);

app.use(express.static('public'))
app.use(express.urlencoded({extended: false}));

app.use(authRoutes);

app.listen(port, () => console.log(`Running on port ${port}`))