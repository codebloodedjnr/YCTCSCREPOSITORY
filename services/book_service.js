const Book = require('../models/book_model');

class BookService {
  // Create a new Book
  static async createBook(data) {
    const book = new Book(data);
    return await book.save();
  }

  // Get a single Book by ID
  static async getBookById(id) {
    return await Book.findById(id)
      .populate('author');
  }

  // Get all Books
  static async getAllBooks(filter) {
    return await Book.find(filter)
      .populate('author');
  }

  // Delete Book by ID
  static async deleteBookById(id) {
    return await Book.findByIdAndDelete(id);
  }

  // Update Book by ID
  static async updateBookById(id, updatedData) {
    return await Book.findByIdAndUpdate(id, updatedData, { new: true });
  }


    // Admin Approve a Book
    static async approveBook(req) {
        return await Book.findByIdAndUpdate(req.params.id, { approved: true });
  }

  static async findBooksByAuthor(authorId, filter) {
    return await Book.find({ author: authorId, ...filter });
  }

  static async attachBooksToAuthor(bookIds, authorId) {
    return await Book.updateMany({ _id: { $in: bookIds } }, { $push: { author: authorId } });
  }

  static async updateBooksByAuthor(authorId, booksIds) {
    return await Book.updateMany(
      {
        _id: { $in: booksIds },
        author: { $ne: authorId }, // only update if author not already in array
      },
      {
        $addToSet: { author: authorId }, // add only if not present
      }
    );
  }

  static async findBooksByAuthor(authorId, filter = {}) {
    return Book.find({ authors: authorId, ...filter });
  }

  static async findBooksByTitle(title) {
    return Book.find({ title: { $regex: title, $options: 'i' } });
  }

  static async findBooksByKeywords(keywords) {
    return Book.find({ keywords: { $regex: keywords, $options: 'i' } });
  }
}

module.exports = BookService;
