import { getBookById, getBooks } from "../controllers/book.js";
import mockBooks from "../__mocks__/books.js";
import Book from "../models/book.js";

describe('GET books', () => {
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

    afterAll(() => {
        Book.sequelize.close();
    });

    it('should return active state books list when no ID provided', async () => {        
        const activeMockBooks = mockBooks.filter(book => book.deletedAt === null);
        jest.spyOn(Book, "findAll").mockResolvedValue(activeMockBooks);

        await getBooks({query:{filter: null}}, mResp, mNext);
        expect(mResp.status).toHaveBeenCalledWith(200)
        expect(mResp.status().json).toHaveBeenCalledWith(activeMockBooks)
    });

    it('should return archived books when filter key "archived" is provided', async () => {
        const archivedMockBooks = mockBooks.filter(book => book.deletedAt !== null);
        jest.spyOn(Book, "findAll").mockResolvedValue(archivedMockBooks);

        await getBooks({query: {filter: 'archived'}}, mResp, mNext);
        expect(mResp.status).toHaveBeenCalledWith(200)
        expect(mResp.status().json).toHaveBeenCalledWith(archivedMockBooks)
    });

    it('should return full books list with "all" filter key provided', async () => {
        jest.spyOn(Book, "findAll").mockResolvedValue(mockBooks);

        await getBooks({query: {filter: 'all'}}, mResp, mNext);
        expect(mResp.status).toHaveBeenCalledWith(200)
        expect(mResp.status().json).toHaveBeenCalledWith(mockBooks)
    });

    it('should get book from books list when given valid ID', async () => {
        const idUsed = 1;
        const mockBook = mockBooks.find(book => book.id === idUsed);
        jest.spyOn(Book, "findByPk").mockResolvedValue(mockBook);

        await getBookById({params: {id: idUsed}}, mResp, mNext);
        expect(mResp.status).toHaveBeenCalledWith(200)
        expect(mResp.status().json).toHaveBeenCalledWith(mockBook);
    });
});
