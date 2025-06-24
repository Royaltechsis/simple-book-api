const Book = require('../models/Book');

// Create a new book
exports.createBook = async (req, res) => {
  try {
    if (!req.body || !req.body.title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const { title, author, description, category, link, addedDate, tags } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Cover image is required' });
    }
    const book = new Book({
      title,
      author,
      description,
      category,
      link,
      coverImage: req.file.buffer,
      coverImageType: req.file.mimetype,
      addedDate: new Date(addedDate),
      tags: typeof tags === 'string' ? JSON.parse(tags) : tags
    });
    await book.save();
    res.status(201).json({ message: 'Book created', book });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books.map(book => ({
      ...book.toObject(),
      coverImageUrl: book.coverImageUrl
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ ...book.toObject(), coverImageUrl: book.coverImageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const { title, author, description, category, link, addedDate, tags } = req.body;
    const updateData = {
      title,
      author,
      description,
      category,
      link,
      addedDate: addedDate ? new Date(addedDate) : undefined,
      tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : undefined
    };
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    if (req.file) {
      updateData.coverImage = req.file.buffer;
      updateData.coverImageType = req.file.mimetype;
    }
    const book = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book updated', book });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
