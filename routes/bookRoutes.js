const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const bookController = require('../controllers/bookController');

router.post('/', upload.single('coverImage'), bookController.createBook);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.put('/:id', upload.single('coverImage'), bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;
