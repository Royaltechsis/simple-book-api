const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: false },
  category: { type: String, required: true },
  link: { type: String, required: true }, // Google Drive link
  coverImage: { type: Buffer, required: false}, // Store image as binary
  coverImageType: { type: String, required: false }, // e.g., 'image/png'
  addedDate: { type: Date, default: Date.now }
});

BookSchema.virtual('coverImageUrl').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};base64,${this.coverImage.toString('base64')}`;
  }
});

module.exports = mongoose.model('Book', BookSchema);
