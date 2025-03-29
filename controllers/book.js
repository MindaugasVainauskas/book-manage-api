import { Op } from "sequelize";
import Book from "../models/book.js";
import { validationResult } from "express-validator";

// Get all books in DB with optional limit option
const getBooks = async (req, res, next) => {
    console.log("Get all books");
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

    res.status(200).json(books);
    next();
};

const getBookById = async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        const error = new Error(`Invalid ID`);
        error.status = 404;
        return next(error);
    };
    
    console.log("Get book with ID ", id);
    const book = await Book.findByPk(id);

    if (!book || typeof book === 'undefined') {
        const error = new Error(`No book with ID ${id} found`);
        error.status = 404;
        return next(error);
    };

    res.status(200).json(book);
};

const addBook = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => `Error: ${err.path} - ${err.msg}`).join(', ');
        console.log("Mapped errors: ", errorMessages);
        const error = new Error(errorMessages);
        error.status = 400;
        return next(error);
    };

    console.log(req.body);
    const newBook = req.body;

    console.log("New book data: ", newBook);
    const newBookInDb = await Book.create({
        title: newBook.title,
        author: newBook.author,
        genre: newBook.genre,
        publishDate: newBook.publishDate
    });
    console.log(newBookInDb);
    const books = await Book.findAll();
    res.status(201).json(books);

    next();
};

const updateBook = async (req, res, next) => {
    const id = parseInt(req.params.id);
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
    console.log("UPDATE_DATA: ", updateData);
    if (Object.keys(updateData).length === 0) {
        const error = new Error(`Must provide at least one field to update.`);
        error.status = 400;
        return next(error);
    };

    await Book.update(updateData, { where: { id: id}});
    const books = await Book.findAll();

    res.status(200).json(books);
};

// Soft deletes book entry from table
const deleteBook = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const book = await Book.findByPk(id);

    if (!book) {
        const error = new Error(`No book with ID ${id} found to delete.`);
        error.status = 404;
        return next(error);
    };

    await Book.destroy({ where: {id: id}});
    const books = await Book.findAll();
    res.status(200).json(books);
};

// Restore soft Deleted Book by id
const restoreArchivedBookById = async (req, res) => {
    const id = parseInt(req.params.id);
    const book = await Book.findOne({wehere: {id: id}, paranoid : false});

    if (!book || book.deletedAt === null) {
        const error = new Error(`No deleted book with ID ${id} found.`);
        error.status = 404;
        return next(error);
    };

    // Restore archived book by setting "deletedAt" flag to null
    await book.restore();
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
