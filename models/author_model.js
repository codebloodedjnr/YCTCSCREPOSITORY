const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  email: String, // optional
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: false, // optional (this line is actually not needed unless you're being explicit)
  }],
});

module.exports = mongoose.model('Author', authorSchema);