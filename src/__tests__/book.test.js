import {
    getBookById,
    getBooks,
    addBook,
    updateBook,
    deleteBook,
    restoreArchivedBookById
} from "../controllers/book.js";
import mockBooks from "../__mocks__/books.js";
import Book from "../models/book.js";

describe('GET Books', () => {
    let mResp;
    let mNext;
    beforeEach(() => {
        jest.resetAllMocks();
        mResp = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mNext = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return active state books list when no ID provided', async () => {        
        const activeMockBooks = mockBooks.filter(book => book.deletedAt === null);
        jest.spyOn(Book, "findAll").mockResolvedValue(activeMockBooks);

        await getBooks({query:{filter: null}}, mResp, mNext);
        expect(mResp.status).toHaveBeenCalledWith(200);
        expect(mResp.status().json).toHaveBeenCalledWith(activeMockBooks);
    });

    it('should return archived books when filter key "archived" is provided', async () => {
        const archivedMockBooks = mockBooks.filter(book => book.deletedAt !== null);
        jest.spyOn(Book, "findAll").mockResolvedValue(archivedMockBooks);

        await getBooks({query: {filter: 'archived'}}, mResp, mNext);
        expect(mResp.status).toHaveBeenCalledWith(200);
        expect(mResp.status().json).toHaveBeenCalledWith(archivedMockBooks);
    });

    it('should return full books list with "all" filter key provided', async () => {
        jest.spyOn(Book, "findAll").mockResolvedValue(mockBooks);

        await getBooks({query: {filter: 'all'}}, mResp, mNext);
        expect(mResp.status).toHaveBeenCalledWith(200);
        expect(mResp.status().json).toHaveBeenCalledWith(mockBooks);
    });

    it('should get book from books list when given valid ID', async () => {
        const idUsed = 1;
        const mockBook = mockBooks.find(book => book.id === idUsed);
        jest.spyOn(Book, "findByPk").mockResolvedValue(mockBook);

        await getBookById({params: {id: idUsed}}, mResp, mNext);
        expect(mResp.status).toHaveBeenCalledWith(200);
        expect(mResp.status().json).toHaveBeenCalledWith(mockBook);
    });
});

describe('POST Books', () => {
    let mResp;
    let mNext;
    beforeEach(() => {
        jest.resetAllMocks();
        mResp = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mNext = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should add new book to list when data provided', async () => {
        // Mock new book data coming into the controller
        const newBookData = {
            "title": "Test book 6",
            "author": "F. Fitzgerald",
            "genre": "Fiction",
            "publishDate": "1990-03-11"
        };

        const newMockBookInDb = Object.assign({}, newBookData);
        const createdDate = new Date();
        // Mocking adding these by DB table on creation
        newMockBookInDb.id = 6;
        newMockBookInDb.createdAt = createdDate;
        newMockBookInDb.updatedAt = createdDate;
        newMockBookInDb.deletedAt = null;

        const updatedMockBooks = mockBooks.push(newMockBookInDb);
        
        jest.spyOn(Book, "create").mockResolvedValue(newMockBookInDb);
        jest.spyOn(Book, "findAll").mockResolvedValue(updatedMockBooks);

        await addBook({body: newBookData}, mResp, mNext);
        expect(mResp.status).toHaveBeenCalledWith(201);
        expect(mResp.status().json).toHaveBeenCalledWith(updatedMockBooks);
    });
});

describe('PUT Books', () => {
    let mResp;
    let mNext;
    beforeEach(() => {
        jest.resetAllMocks();
        mResp = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mNext = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    it('Should update existing book in the list with data provided when ID is provided', async () => {
        const idUsed = 1;
        const newTitle = "Test book 11";
        const mReq = {
            params: { id: idUsed},
            body: { title: newTitle}
        };
        const mockBook = mockBooks.find(book => book.id === idUsed);
        const updatedBookData = Object.assign({}, mockBook);
        // Update found mock book data with provided mock update data in mock request body.
        updatedBookData.title = newTitle;
        // Get initial mocked book from mock DB list in first findByPk call. get updated entry after successful update.
        jest.spyOn(Book, "findByPk")
        .mockResolvedValueOnce(mockBook)
        .mockResolvedValueOnce(updatedBookData);
        jest.spyOn(Book, "update").mockResolvedValue(updatedBookData);

        await updateBook(mReq, mResp, mNext);
        expect(mResp.status).toHaveBeenCalledWith(200);
        expect(mResp.status().json).toHaveBeenCalledWith(updatedBookData);
    });

    it('Should restore soft deleted book by removing deletedAt flag in DB table when ID of book is provided', async () => {
        const idUsed = 3;
        const mReq = {
            params: {
                id: idUsed
            }
        };
        // Get mock book from mock list that has deletedAt flag setup.
        const mockDeletedBook = mockBooks.find(book => book.id === idUsed && book.deletedAt);        
        const restoredBook = Object.assign({}, mockDeletedBook);
        restoredBook["deletedAt"] = null;
        // Since this function is called twice in controller, I need to provide mock of what is returned each time.
        jest.spyOn(Book, "findOne")
        .mockResolvedValueOnce(mockDeletedBook)
        .mockResolvedValueOnce(restoredBook);
        jest.spyOn(Book, "restore").mockResolvedValue(restoredBook);
        // Second call to make sure book has been restored successfully.

        await restoreArchivedBookById(mReq, mResp, mNext);
        expect(mResp.status).toHaveBeenCalledWith(200);
        expect(mResp.status().json).toHaveBeenCalledWith(restoredBook);
    });
});

describe('DELETE Books', () => {
    let mResp;
    let mNext;
    beforeEach(() => {
        jest.resetAllMocks();
        mResp = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mNext = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('Should delete book when ID provided', async () => {
        const idUsed = 1;
        const mReq = {
            params: {
                id: idUsed
            }
        };

        const bookToDelete = mockBooks.find(b => b.id === idUsed);

        const updatedMockBooksList = mockBooks.filter(b => b.id !== idUsed);

        jest.spyOn(Book, "findByPk").mockResolvedValue(bookToDelete);
        // Destroy only returns number of rows destroyed so in here it is expecting resolve value of 1
        jest.spyOn(Book, "destroy").mockResolvedValue(1);
        jest.spyOn(Book, "findAll").mockResolvedValue(updatedMockBooksList);

        await deleteBook(mReq, mResp, mNext);
        expect(mResp.status).toHaveBeenCalledWith(200);
        expect(mResp.status().json).toHaveBeenCalledWith(updatedMockBooksList);
    });
});
