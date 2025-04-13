const Bookmark = require('../models/bookmark_models');
const Book = require('../models/book_model');
const User = require('../models/usermodel');

class BookmarkService {
  // Create a new bookmark
  static async createBookmark(userId, bookId) {
    try {
      // Check if the book exists
      const book = await Book.findById(bookId);
      if (!book) {
        throw new Error('Book not found');
      }

      // Check if the user has already bookmarked the book
      const existingBookmark = await Bookmark.findOne({ user: userId, book: bookId });
      if (existingBookmark) {
        throw new Error('Book already bookmarked');
      }

      // Create and save the new bookmark
      const bookmark = new Bookmark({ user: userId, book: bookId });
      await bookmark.save();
      return bookmark;
    } catch (error) {
      throw error; // Will be caught by the controller
    }
  }

  // Get all bookmarks for a user
  static async getUserBookmarks(userId) {
    try {
      const bookmarks = await Bookmark.find({ user: userId }).populate('book');
      return bookmarks;
    } catch (error) {
      throw error; // Will be caught by the controller
    }
  }

  // Remove a bookmark
  static async removeBookmark(bookmarkId) {
    try {
      const bookmark = await Bookmark.findOneAndDelete({ _id: bookmarkId });
      return bookmark;
    } catch (error) {
      throw error; // Will be caught by the controller
    }
  }
}

module.exports = BookmarkService;
