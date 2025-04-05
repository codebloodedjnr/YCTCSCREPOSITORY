const express = require('express');
const router = express.Router();
const AuthorController = require('../controllers/author_controllers');


router.post('/', AuthorController.createAuthor);
router.get('/:id', AuthorController.getAuthorById);
router.get('/', AuthorController.getAllAuthors);
router.put('/:id', AuthorController.updateAuthorById);
router.delete('/:id', AuthorController.deleteAuthorById);

module.exports = router;
