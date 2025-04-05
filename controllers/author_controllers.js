const AuthorService = require('../services/author_service');

class AuthorController {
  // POST /authors
  static async createAuthor(req, res) {
    try {
      const author = await AuthorService.createAuthor(req.body);
      res.status(201).json(author);
    } catch (error) {
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
        return res.status(403).json({ error: 'Only admins can delete authors linked to approved books' });
      }

      const updated = await AuthorService.updateAuthorById(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Author not found' });

      res.json(updated);
    } catch (error) {
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
