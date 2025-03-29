import express from 'express';
import booksRouter from './routes/books.js';
import db from './utils/database-config.js';
import logger from './middleware/logger/index.js';
import {
    errorHandler,
    pageNotFoundErrorhandler
} from './middleware/errors/index.js';
const app = express();
const PORT = process.env.PORT || 3001;

// Syncing Sequelize DB on start of server.
db.sync();

// Bodyparser middleware
app.use(express.json());

// Form data middleware
app.use(express.urlencoded({extended: false}));

// Logger middleware
app.use(logger);

// Routes middleware
app.use('/api/books', booksRouter);

// Page not found error handler
app.use(pageNotFoundErrorhandler);

// Standard error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Express app listening on port ${PORT}`);
});
