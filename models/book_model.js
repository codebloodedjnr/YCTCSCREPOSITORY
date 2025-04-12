const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  cloudinaryUrl: String,
  keywords: [String],
  cartegory: { type: String, enum: ['OND', 'HND']},
  sub_cartegory : { type: String, enum: ['PROJECTS', 'LECTURE_NOTES', "PAST_QUESTION", "DEPARTMENTAL_PUBLICATIONS"]},
  downloadCount: { type: Number, default: 0 },
  file_size: { type: Number, default: 0 },
  approved: { type: Boolean, default: false },
  uploadedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }]  // ✅ link to User
});

// Convert _id to id and remove unnecessary fields when returning JSON
bookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Book", bookSchema);