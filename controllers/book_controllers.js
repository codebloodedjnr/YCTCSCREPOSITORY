const { Logger } = require('logger');
const BookService = require('../services/book_service');
const emailServices = require("../services/emailservice");

function isAdmin(req) {
  return req.user && req.user.role === 'admin';
}

class BookController {
  // POST /books
  static async createBook(req, res) {
    try {
      if (!isAdmin(req)) {
        req.body.approved = false;
      }
      const book = await BookService.createBook(req.body);
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create book' });
    }
  }

  // GET /books/:id
  static async getBookById(req, res) {
    try {
      const book = await BookService.getBookById(req.params.id);
      if (!book) return res.status(404).json({ error: 'Book not found' });
      if (!isAdmin(req) && !book.approved) {
        return res.status(403).json({ error: 'This book is not yet approved' });
      }  
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch book' });
    }
  }

  // GET /books
  static async getAllBooks(req, res) {
    try {
      const filter = isAdmin(req) ? {} : { approved: true };
      const books = await BookService.getAllBooks(filter);
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  }

  // PUT /books/:id
  static async updateBookById(req, res) {
    try {
      const book = await BookService.getBookById(req.params.id);

    // Only admin can update if book is approved
    if (book.approved && !isAdmin(req)) {
      return res.status(403).json({ error: 'Only admins can modify approved books' });
    }

    // Only admin can change the approved field
    if (!isAdmin(req)) {
      delete req.body.approved;
    }

      const updated = await BookService.updateBookById(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Book not found' });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update book' });
    }
  }

  // DELETE /books/:id
  static async deleteBookById(req, res) {
    try {

      const book = await BookService.getBookById(req.params.id);

      // Only admin can update if book is approved
      if (book.approved && !isAdmin(req)) {
        return res.status(403).json({ error: 'Only admins can modify approved books' });
      }
    
      // Only admin can change the approved field
      if (!isAdmin(req)) {
        delete req.body.approved;
      }

      const result = await BookService.deleteBookById(req.params.id);
      if (result.deletedCount === 0) return res.status(404).json({ error: 'Book not found' });
      const deleted = await BookService.deleteBookById(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Book not found' });

      res.json({ message: 'Book deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete book' });
    }
  }

  static async approveBookById(req, res) {
    try {
      if (!isAdmin(req)) return res.status(403).json({ error: 'Forbidden' });
      const updated = await BookService.approveBook(req.params.id);
      if (!updated) return res.status(404).json({ error: 'Book not found' });

      // 🔔 Notify contributors
      await emailServices.sendApprovalEmailToContributors(updated);
    
      res.json({ message: 'Book approved', book: updated });
    } catch (err) {
        res.status(500).json({ error: 'Failed to approve book' });
    }
  }

  static async findBooksByAuthor(authorId, filter = {}) {
    return Book.find({ authors: authorId, ...filter });
  }

}

module.exports = BookController;
