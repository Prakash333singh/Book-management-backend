const express = require("express");
const bookController = require("../controllers/bookController");

// Express Router
bookRouter = express.Router();

// Fetch all books
bookRouter.get("/get-books", bookController.getAllBooks);

// Fetch single book by (Author & title) or ISBN
bookRouter.get("/get-book", bookController.getBookByDetails);

// Fetch single book by Id
bookRouter.get("/get-book/:id", bookController.getBookById);

// Add a new book to database
bookRouter.post("/add-book", bookController.addNewBook);

// Update a book details
bookRouter.patch("/update-book/:id", bookController.updateBookById);

// Delete book by (Author & title) or ISBN
bookRouter.delete("/delete-book", bookController.deleteBookByDetails);

// Delete book by Id
bookRouter.delete("/delete-book/:id", bookController.deleteBookById);


module.exports = bookRouter;