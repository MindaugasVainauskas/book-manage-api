import Book from "../models/book.js";

// Get all books in DB with optional limit option
const getBooks = async (req, res, next) => {
    console.log("Get all books");
    const limit = parseInt(req.query.limit);

    const books = await Book.findAll();

    if (!isNaN(limit) && limit > 0) {
        return res.status(200).json(books.slice(0, limit));        
    };

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

// TODO -- Add findDeletedBookById(id)
// TODO -- Add restoreDeletedBook(id)


export {
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook
};