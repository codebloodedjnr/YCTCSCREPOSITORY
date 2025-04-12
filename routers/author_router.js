const express = require('express');
const router = express.Router();
const AuthorController = require('../controllers/author_controllers');
const schema = require("../schema/validationschema");


router.post(
    '/', 
    validate(schema.authorSchema, "body"),
    AuthorController.createAuthor
);

router.get('/:id', AuthorController.getAuthorById);

router.get('/', AuthorController.getAllAuthors);

router.put(
    '/:id',
    validate(schema.authorSchema, "body"), 
    AuthorController.updateAuthorById
);

router.delete('/:id', AuthorController.deleteAuthorById);

module.exports = router;
