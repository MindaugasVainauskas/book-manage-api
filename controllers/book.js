import { Op } from "sequelize";
import Book from "../models/book.js";

// Get all books in DB with optional limit option
const getBooks = async (req, res, next) => {
    console.log("Get all books");
    console.log("REQ_QUERY: ", req.query);
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
        
    console.log("QUERY_USED: ", dbQuery);
    const books = await Book.findAll(dbQuery);

    res.status(200).json(books);
    next();
};

const getBookById = async (req, res, next) => {
    const id = parseInt(req.params.id);
    console.log("Get book with ID ", id);
    const book = await Book.findByPk(id);

    if (!book || typeof book === 'undefined') {
        return res.status(404).send(`No book with ID ${id} found`);
    };

    res.status(200).json(book);
    next();
};

const addBook = async (req, res, next) => {
    console.log(req.body);
    const newBook = req.body;
    if (!newBook.title || !newBook.author || !newBook.genre || !newBook.publishDate) {
        return res.status(400).json({msg: "Missing book details. Can't add new book."});
    }
    console.log("New book data: ", newBook);
    const newBookInDb = await Book.create({
        title: newBook.title,
        author: newBook.author,
        genre: newBook.genre,
        publish_date: newBook.publishDate
    });
    console.log(newBookInDb);
    const books = await Book.findAll();
    res.status(201).json(books);

    next();
};

const updateBook = async (req, res) => {
    const id = parseInt(req.params.id);
    const book = await Book.findByPk(id);

    if (!book) {
        return res.status(404).json({msg: `No book with ID ${id} found to update.`});
    };

    const updateData = req.body;

    await Book.update(updateData, { where: { id: id}});
    const books = await Book.findAll();

    res.status(200).json(books);
};

// Soft deletes book entry from table
const deleteBook = async (req, res) => {
    const id = parseInt(req.params.id);
    const book = await Book.findByPk(id);

    if (!book) {
        return res.status(404).json({msg: `No book with ID ${id} found to delete.`});
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
        return res.status(404).json({msg: `No deleted book with ID ${id} found.`})
    };

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
