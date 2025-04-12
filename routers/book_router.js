const express = require('express');
const router = express.Router();
const BookController = require('../controllers/book_controllers');
const schema = require("../schema/validationschema");
const { validate } = require('../models/otpmodel');

router.post(
    '/',
    validate(schema.bookSchema, "body"), 
    BookController.createBook
);

router.get('/:id', BookController.getBookById);

router.get('/', BookController.getAllBooks);

router.put('/:id', BookController.updateBookById);

router.delete('/:id', BookController.deleteBookById);

router.patch(
    '/:id/approve', 
    validate(schema.approveBookSchema, "body"), 
    BookController.approveBookById
);

module.exports = router;
