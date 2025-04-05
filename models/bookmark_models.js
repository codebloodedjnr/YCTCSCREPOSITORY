const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Referencing the User model
    required: true 
  },
  book: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book', // Referencing the Book model
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Convert _id to id and remove unnecessary fields when returning JSON
bookmarkSchema.set("toJSON", {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
