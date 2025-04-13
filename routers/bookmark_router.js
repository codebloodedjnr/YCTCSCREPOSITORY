const express = require('express');
const router = express.Router();
const BookmarkController = require('../controllers/bookmark_controllers');
// const middleware = require('../utils/middleware'); // Make sure user is authenticated
const schema = require('../schema/validationschema');
const validate = require('../utils/validate');


// Protect routes with authentication middleware
router.post('', validate(schema.bookmarkSchema, 'body'), BookmarkController.createBookmark);
router.get('', BookmarkController.getUserBookmarks);
router.delete('/:bookmarkId', BookmarkController.removeBookmark);

module.exports = router;
