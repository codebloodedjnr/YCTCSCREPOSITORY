const express = require('express');
const router = express.Router();
const BookController = require('../controllers/book_controllers');
const schema = require("../schema/validationschema");
const validate = require("../utils/validate");


router.post(
    '/',
    validate(schema.bookSchema, 'body'),  // Validate the request body
    BookController.createBook            // Then call the createBook controller
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
