import express from 'express';
const router = express.Router();
import {
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    restoreArchivedBookById,
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
router.delete('/:id', deleteBook);

// Restore soft deleted book in DB
router.put('/restore/:id', restoreArchivedBookById);

export default router;
