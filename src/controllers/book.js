import { Op } from "sequelize";
import Book from "../models/book.js";
import { validationResult } from "express-validator";
import { logger }from "../middleware/logger/index.js";

// Get all books in DB with optional limit option
const getBooks = async (req, res, next) => {
    logger.debug("Get all books");
    const {filter} = req.query;
    let dbQuery = {};

    // Change filtered query according to book active state if user wants so.
    // Default is active books only.
    switch (filter) {
        case 'archived':
            dbQuery = {where: {deletedAt: {[Op.not]: null}}, paranoid: false};
            break;
        case 'all':
            dbQuery = {paranoid: false};
            break;
        default:
            break;
    };

    const books = await Book.findAll(dbQuery);

    logger.info("Retrieved all available books.");
    res.status(200).json(books);
};

const getBookById = async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        const error = new Error(`Invalid ID`);
        error.status = 404;
        return next(error);
    };

    logger.debug("Get book with ID ", id);
    const book = await Book.findByPk(id);

    if (!book || typeof book === 'undefined') {
        const error = new Error(`No book with ID ${id} found`);
        error.status = 404;
        return next(error);
    };

    logger.info(`Retrieved book with ID: ${id}`);
    res.status(200).json(book);
};

const addBook = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => `Error: ${err.path} - ${err.msg}`).join(', ');
        const error = new Error(errorMessages);
        error.status = 400;
        return next(error);
    };

    logger.debug(req.body);
    const newBook = req.body;

    logger.debug("New book data: ", newBook);
    const newBookInDb = await Book.create({
        title: newBook.title,
        author: newBook.author,
        genre: newBook.genre,
        publishDate: newBook.publishDate
    });
    logger.debug(newBookInDb);
    const books = await Book.findAll();
    logger.info(`Successfully added new book to library.`);
    res.status(201).json(books);

    next();
};

const updateBook = async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        const error = new Error(`Invalid ID`);
        error.status = 404;
        return next(error);
    };
    const book = await Book.findByPk(id);

    if (!book) {
        const error = new Error(`No book with ID ${id} found to update.`);
        error.status = 404;
        return next(error);
    };
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => `Error: ${err.path} - ${err.msg}`).join(', ');
        const error = new Error(errorMessages);
        error.status = 400;
        return next(error);
    };

    const updateData = req.body;
    logger.debug("UPDATE_DATA: ", updateData);
    if (Object.keys(updateData).length === 0) {
        const error = new Error(`Must provide at least one field to update.`);
        error.status = 400;
        return next(error);
    };

    await Book.update(updateData, { where: { id: id}});
    const books = await Book.findAll();
    logger.info(`Successfully updated book with ID ${id}`);
    res.status(200).json(books);
};

// Soft deletes book entry from table
const deleteBook = async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        const error = new Error(`Invalid ID`);
        error.status = 404;
        return next(error);
    };
    const book = await Book.findByPk(id);

    if (!book) {
        const error = new Error(`No book with ID ${id} found to delete.`);
        error.status = 404;
        return next(error);
    };

    await Book.destroy({ where: {id: id}});
    const books = await Book.findAll();
    logger.info(`Successfully archived book with ID ${id}`);
    res.status(200).json(books);
};

// Restore soft Deleted Book by id
const restoreArchivedBookById = async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        const error = new Error(`Invalid ID`);
        error.status = 404;
        return next(error);
    };

    const book = await Book.findOne({where: {id: id}, paranoid : false});

    if (!book || book.deletedAt === null) {
        const error = new Error(`No deleted book with ID ${id} found.`);
        error.status = 404;
        return next(error);
    };

    // Restore archived book by setting "deletedAt" flag to null
    await book.restore();
    logger.info(`Successfully restored book with ID ${id}`);
    res.status(200).json(book);
};


export {
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    restoreArchivedBookById,
};
