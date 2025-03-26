import express from 'express';
const router = express.Router();

// Books data mock.
let books = [
    {
        id: 1,
        title: "book 1",
        author: "A. Adams",
        genre: "Fiction"
    },
    {
        id: 2,
        title: "book 2",
        author: "B. Boore",
        genre: "Romance"
    },
    {
        id: 3,
        title: "book 3",
        author: "C. Cant",
        genre: "Biography"
    },
];

// Get all books with limit option
router.get('/', (req, res, next) => {
    console.log("Get all books");
    const limit = parseInt(req.query.limit);

    if (!isNaN(limit) && limit > 0) {
        res.status(200).json(books.slice(0, limit));        
    };

    res.status(200).json(books);
    next();
});

// Get specific book with ID
router.get('/:id', (req, res, next) => {
    const {id} = req.params;
    console.log(typeof id);
    console.log("Get book with ID ", id);
    const book = books.find(b => b.id === parseInt(id));

    if (!book || typeof book === 'undefined') {
        res.status(404).send(`No book with ID ${id} found`);
    };

    res.status(200).json(book);
    next();
});

// Add new book
router.post('/', (req, res, next) => {
    console.log(req.body);
    const newBook = req.body;

    if (!newBook.id || !newBook.title || !newBook.author || !newBook.genre) {
        return res.status(400).json({msg: "Missing book details. Can't add new book."});
    }

    if (books.find(b => b.id === newBook.id)) {
        return res.status(400).json({msg: `Book with ID ${newBook.id} already exists in library`});
    }
    
    books.push(newBook);
    res.status(201).json(books);

    next();
});

// Update book details
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({msg: `No book with ID ${id} found to update.`});
    };

    const updateData = req.body;

    Object.assign(book, updateData);

    res.status(200).json(books);
});

// Delete book
// Update book details
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({msg: `No book with ID ${id} found to delete.`});
    };

    books = books.filter(b => b.id !== id);

    res.status(200).json(books);
});

export default router;
