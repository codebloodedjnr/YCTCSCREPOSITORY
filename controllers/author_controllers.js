const AuthorService = require('../services/author_service');
const BookService = require('../services/book_service');

function isAdmin(req) {
  return req.user && req.user.role === 'admin';
}


async function filterValidBookIds(bookIds) {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;

  const validBooks = [];

  for (const id of bookIds) {
    // Ensure it's a valid ObjectId format
    if (!objectIdRegex.test(id)) continue;

    // Check if it exists in the DB
    const book = await BookService.getBookById(id);
    if (book) {
      validBooks.push(id);
    }
  }

  return validBooks;
}

class AuthorController {
  // POST /authors
  static async createAuthor(req, res) {
    try {
      let author = await AuthorService.getAuthorByEmail(req.body.email);
      if (author) {
        let new_books = await filterValidBookIds(req.body.books);
        if (new_books.length == 0) {
          return res.status(400).json({ error: 'No valid book IDs provided.' });
        }
        author.books = [...new Set([...author.books, ...new_books])];
        author = await AuthorService.updateAuthorById(author._id, author);
      }
      else {
        author = await AuthorService.createAuthor(req.body);
      }

      //update books
    await BookService.updateBooksByAuthor(author._id, req.body.books);
      res.status(201).json(author);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create author' });
    }
  }

  // GET /authors/:id
  static async getAuthorById(req, res) {
    try {
      const author = await AuthorService.getAuthorById(req.params.id);
      if (!author) return res.status(404).json({ error: 'Author not found' });

      res.json(author);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch author' });
    }
  }

  // GET /authors
  static async getAllAuthors(req, res) {
    try {
      const authors = await AuthorService.getAllAuthors();
      res.json(authors);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch authors' });
    }
  }

  // PUT /authors/:id
  static async updateAuthorById(req, res) {
    try {
      const linkedApprovedBooks = await BookService.findBooksByAuthor(req.params.id, { approved: true });

      if (linkedApprovedBooks.length > 0 && !isAdmin(req)) {
        return res.status(403).json({ error: 'Only admins can edit authors linked to approved books' });
      }

      let new_books = await filterValidBookIds(req.body.books);
      if (new_books.length == 0) {
        return res.status(400).json({ error: 'No valid book IDs provided.' });
      }

      const updated = await AuthorService.updateAuthorById(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Author not found' });
      await BookService.updateBooksByAuthor(req.params.id, req.body.books);
      res.json(updated);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to update author' });
    }
  }

  // DELETE /authors/:id
  static async deleteAuthorById(req, res) {
    try {
      const linkedApprovedBooks = await BookService.findBooksByAuthor(req.params.id, { approved: true });

      if (linkedApprovedBooks.length > 0 && !isAdmin(req)) {
        return res.status(403).json({ error: 'Only admins can delete authors linked to approved books' });
      }
      
      const deleted = await AuthorService.deleteAuthorById(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Author not found' });

      res.json({ message: 'Author deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete author' });
    }
  }
}

module.exports = AuthorController;
