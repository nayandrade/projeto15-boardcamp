import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import chalk from 'chalk';
import connection from './database/database.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.listen(process.env.PORT, () => {
    console.log(chalk.bold.bgRed(`Server is listening on port ${process.env.PORT}`));
});