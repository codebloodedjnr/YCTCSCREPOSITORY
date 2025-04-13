const Author = require('../models/author_model');

class AuthorService {
  // Create a new author
  static async createAuthor(data) {
    const author = new Author(data);
    return await author.save();
  }

  // Get a single author by ID
  static async getAuthorById(id) {
    return await Author.findById(id).populate('books');
  }

  static async getAuthorByEmail(email) {
    return await Author.findOne({ email: email }).populate('books');
  }

  // Get all authors
  static async getAllAuthors() {
    return await Author.find().populate('books');
  }

  // Delete author by ID
  static async deleteAuthorById(id) {
    return await Author.findByIdAndDelete(id);
  }

  // Update author by ID
  static async updateAuthorById(id, updatedData) {
    return await Author.findByIdAndUpdate(id, updatedData, { new: true });
  }
}

module.exports = AuthorService;
