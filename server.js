import express from 'express';
import booksRouter from './routes/books.js';
const app = express();
const PORT = process.env.PORT || 3001;

// Bodyparser middleware
app.use(express.json());

// Form data middleware
app.use(express.urlencoded({extended: false}));

// Routes middleware
app.use('/api/books', booksRouter);

app.listen(PORT, () => {
    console.log(`Express app listening on port ${PORT}`);
});
