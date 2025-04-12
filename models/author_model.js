const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  email: String, // optional
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    validate: {
      validator: function(value) {
        // Convert ObjectId to string and check for duplicates in the array
        const bookIdStrings = value.map(book => book.toString());  // Convert ObjectId to string
        return bookIdStrings.length === new Set(bookIdStrings).size; // Check if the array has duplicates
      },
      message: 'Books array contains duplicates.',
    },
    required: true, // optional (this line is actually not needed unless you're being explicit)
  }],
});


// Convert _id to id and remove unnecessary fields when returning JSON
authorSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Author', authorSchema);