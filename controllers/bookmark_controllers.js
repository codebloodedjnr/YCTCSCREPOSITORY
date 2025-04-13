const BookmarkService = require('../services/bookmark_service');

class BookmarkController {
  // POST /bookmark
  static async createBookmark(req, res) {
    try {
      const { bookId } = req.body;
      const userId = req.user._id; // Assuming the user is authenticated and added to req.user

      let bookmarks = await BookmarkService.getUserBookmarks(userId);
      if (bookmarks.some((bookmark) => bookmark.book.toString() === bookId)) {
        return res.status(400).json({ error: 'Book already bookmarked' });
      }
      const bookmark = await BookmarkService.createBookmark(userId, bookId);
      res.status(201).json({ message: 'Book bookmarked successfully', bookmark });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // GET /bookmarks
  static async getUserBookmarks(req, res) {
    try {
      const userId = req.user._id; // Get the authenticated user's ID

      const bookmarks = await BookmarkService.getUserBookmarks(userId);
      if (bookmarks.length === 0) {
        return res.status(404).json({ error: 'No bookmarks found' });
      }

      res.json(bookmarks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // DELETE /bookmark/:bookId
  static async removeBookmark(req, res) {
    try {
      await BookmarkService.removeBookmark(req.params.bookmarkId);
      res.json({ message: 'Bookmark removed successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = BookmarkController;
