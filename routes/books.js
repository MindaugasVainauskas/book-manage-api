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
import { validateBookAdd, validateBookUpdate } from '../middleware/validators/index.js';

// Get all books
router.get('/', getBooks);

// Get specific book with ID
router.get('/:id', getBookById);

// Add new book
router.post('/', validateBookAdd, addBook);

// Update book details
router.put('/:id', validateBookUpdate, updateBook);

// Delete book
router.delete('/:id', deleteBook);

// Restore soft deleted book in DB
router.put('/restore/:id', restoreArchivedBookById);

export default router;
