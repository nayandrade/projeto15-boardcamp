import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import chalk from 'chalk';

import rentalsRouter from './routes/rentalsRouter.js';
import categoriesRouter from './routes/categoriesRouter.js';
import customersRouter from './routes/customersRouter.js';
import gamesRouter from './routes/gamesRouter.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(rentalsRouter);
app.use(categoriesRouter);
app.use(customersRouter);
app.use(gamesRouter);

app.listen(process.env.PORT, () => {
    console.log(chalk.bold.bgRed(`Server is listening on port ${process.env.PORT}`));
});