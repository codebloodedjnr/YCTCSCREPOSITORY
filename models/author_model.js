const mongoose = require('mongoose');
const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  email: String, // optional
  books: [{
    type: String,  // Store ObjectId as a string
    required: true,
    validate: {
      validator: async function(value) {
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!objectIdRegex.test(value)) return false;
  
        const bookExists = await mongoose.model('Book').findById(value);
        return !!bookExists;
      },
      message: props => `${props.value} is not a valid ObjectId or does not exist.`,
    }
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

authorSchema.path('books').validate(function(value) {
  // Check if the array has duplicates
  const bookIdStrings = value.map(book => book.toString());
  return bookIdStrings.length === new Set(bookIdStrings).size; // Check for duplicates
}, 'Books array contains duplicates.');

module.exports = mongoose.model('Author', authorSchema);