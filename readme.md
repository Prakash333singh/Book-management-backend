# Book Management Backend App

This Node.js backend application is designed for managing books, employing the Express framework, Nodemon for automatic server restarts, and MongoDB as the database.

## Tech Used

This project leverages the following technologies:

- **Node.js**: A JavaScript runtime for building server-side applications.
- **Express**: A fast and minimalist web framework for Node.js.
- **Nodemon**: Monitors for changes in your source code and automatically restarts the server.
- **MongoDB**: A NoSQL database for storing and retrieving book data.


## Book Model

The book model encompasses the following attributes:

- **Title**
- **Author**
- **Summary**
- **ISBN (13 digit)**

## CRUD Routes

# API's Overview

- **Fetch All Books:**
  - Endpoint: `/api/get-books`
  - Method: GET
  - Controller: `bookController.getAllBooks`
  - Description: Retrieves a list of all books stored in the database.

- **Fetch Single Book by (Author & Title) or ISBN:**
  - Endpoint: `/api/get-book`
  - Method: GET
  - Controller: `bookController.getBookByDetails`
  - Description: Fetches a single book based on either the author and title or the ISBN.

- **Fetch Single Book by Id:**
  - Endpoint: `/api/get-book/:id`
  - Method: GET
  - Controller: `bookController.getBookById`
  - Description: Retrieves a single book by providing its unique identifier.

- **Add a New Book to Database:**
  - Endpoint: `/api/add-book`
  - Method: POST
  - Controller: `bookController.addNewBook`
  - Description: Adds a new book to the database. Include book details in the request body.

- **Update Book Details by Id:**
  - Endpoint: `/api/update-book/:id`
  - Method: PATCH
  - Controller: `bookController.updateBookById`
  - Description: Updates the details of a specific book by providing its unique identifier and new details in the request body.

- **Delete Book by (Author & Title) or ISBN:**
  - Endpoint: `/api/delete-book`
  - Method: DELETE
  - Controller: `bookController.deleteBookByDetails`
  - Description: Deletes a book based on either the author and title or the ISBN.

- **Delete Book by Id:**
  - Endpoint: `/api/delete-book/:id`
  - Method: DELETE
  - Controller: `bookController.deleteBookById`
  - Description: Deletes a book by providing its unique identifier.

