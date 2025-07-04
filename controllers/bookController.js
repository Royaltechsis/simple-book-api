const Book = require('../models/Book');

// Create a new book
exports.createBook = async (req, res) => {
  try {
    if (!req.body || !req.body.title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const { title, author, description, category, link } = req.body;
    const bookData = {
      title,
      author,
      description,
      category,
      link
      // addedDate is set automatically
    };
    if (req.file) {
      bookData.coverImage = req.file.buffer;
      bookData.coverImageType = req.file.mimetype;
    }
    const book = new Book(bookData);
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
    const { title, author, description, category, link } = req.body;
    const updateData = {
      title,
      author,
      description,
      category,
      link
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
