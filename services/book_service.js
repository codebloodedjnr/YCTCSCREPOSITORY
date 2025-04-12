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
  }

  // Get all Books
  static async getAllBooks(filter) {
    return await Book.find(filter).populate('books')
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

}

module.exports = BookService;
