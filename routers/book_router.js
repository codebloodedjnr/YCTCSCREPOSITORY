const express = require('express');
const router = express.Router();
const BookController = require('../controllers/book_controllers');

router.post('/', BookController.createBook);
router.get('/:id', BookController.getBookById);
router.get('/', BookController.getAllBooks);
router.put('/:id', BookController.updateBookById);
router.delete('/:id', BookController.deleteBookById);
router.patch('/:id/approve', BookController.approveBookById);

module.exports = router;
