const express = require('express');
const router = express.Router();
const BookmarkController = require('../controllers/bookmark_controllers');
const middleware = require('../utils/middleware'); // Make sure user is authenticated

// Protect routes with authentication middleware
router.post('/bookmark', middleware.verifyToken, BookmarkController.createBookmark);
router.get('/bookmarks', middleware.verifyToken, BookmarkController.getUserBookmarks);
router.delete('/bookmark/:bookId', middleware.verifyToken, BookmarkController.removeBookmark);

module.exports = router;
