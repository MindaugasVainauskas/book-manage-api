import express from 'express';
const router = express.Router();
import {
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook
} from '../controllers/book.js';


// Get all books
router.get('/', getBooks);

// Get specific book with ID
router.get('/:id', getBookById);

// Add new book
router.post('/', addBook);

// Update book details
router.put('/:id', updateBook);

// Delete book
// Update book details
router.delete('/:id', deleteBook);

export default router;
