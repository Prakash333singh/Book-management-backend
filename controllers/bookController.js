const Book = require("../models/book");
const generateISBN = require("../utils/isbnGenerator");

// Add a new book to database
const addNewBook = async (req,res) => {
    const bookTitle = req.body.title;
    const bookAuthor = req.body.author;
    const bookSummary = req.body.summary;

    if(!bookTitle || !bookAuthor || !bookSummary){
        return res.send({
            "success": false,
            "error_code": 400,
            "message": "Add book title, author and summary",
            "data": null
        });
    }

    try {
        const alreadyExists = await Book.findOne({
            title: bookTitle,
            author: bookAuthor
        });

        if(alreadyExists){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Book already exists, cannot create again!",
                "data": null
            });
        }

        const bookISBN = generateISBN();
        const isbnExists = await Book.findOne({
            ISBN: bookISBN
        });

        if(isbnExists){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "ISBN already exists for some other book, try creating again",
                "data": null
            });
        }

        const newBook = new Book({
            title: bookTitle,
            author: bookAuthor,
            summary: bookSummary,
            ISBN: bookISBN
        });

        await Book.create(newBook);

        return res.send({
            "success": true,
            "error_code": null,
            "message": "Successfully added a new Book",
            "data": newBook
        });
        
    } catch (err) {
        return res.send({
            "success": false,
            "error_code": 500,
            "message": err.message,
            "data": null
        });
    }
};

// Fetch all books
const getAllBooks = async (req,res) => {
    try{
        const allBooks = await Book.find();

        if(allBooks.length === 0){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "No books found, add some books first",
                "data": []
            });
        }

        return res.send({
            "success": true,
            "error_code": null,
            "message": "Successfully fetched all Books",
            "data": allBooks
        });

    } catch(err){
        return res.send({
            "success": false,
            "error_code": 500,
            "message": err.message,
            "data": null
        });
    }
};

// Fetch a book by (Author & title) or ISBN
const getBookByDetails = async (req,res) => {
    const bookTitle = req.body.title || null;
    const bookAuthor = req.body.author || null;

    const bookISBN = req.body.ISBN || null;

    try {
        if(!bookISBN){
            if(!bookTitle || !bookAuthor){
                return res.send({
                    "success": false,
                    "error_code": 400,
                    "message": "Unable to fetch, Either give Book ISBN or Book author & title",
                    "data": null
                });
            }

            const singleBook = await Book.findOne({
                title: bookTitle,
                author: bookAuthor
            });

            if(!singleBook){
                return res.send({
                    "success": false,
                    "error_code": 400,
                    "message": "Book Does not exist",
                    "data": null
                });
            }

            return res.send({
                "success": true,
                "error_code": 200,
                "message": "Successfully fetched the book by title & author",
                "data": singleBook
            });
        }

        if(bookISBN.length !== 13){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Invalid ISBN, ISBN should be of 13 digits and start with 978..",
                "data": null
            });
        }

        const singleBook = await Book.findOne({
            ISBN: bookISBN
        });

        if(!singleBook){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Book Does not exist",
                "data": null
            });
        }

        return res.send({
            "success": true,
            "error_code": 200,
            "message": "Successfully fetched the book by ISBN",
            "data": singleBook
        });

    } catch (err) {
        return res.send({
            "success": false,
            "error_code": 500,
            "message": err.message,
            "data": null
        });
    }
};

// Fetch a book by Id
const getBookById = async (req,res) => {
    const bookId = req.params.id;

    try {
        const singleBook = await Book.findById(bookId);

        if(!singleBook){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Book does not Exist, Inalid Book Id",
                "data": null
            });
        }

        return res.send({
            "success": true,
            "error_code": 200,
            "message": "Successfully fetched the book by Id",
            "data": singleBook
        });

    } catch (err) {
        return res.send({
            "success": false,
            "error_code": 500,
            "message": err.message,
            "data": null
        });
    }
};

// Update book details by Id
const updateBookById = async (req,res) => {
    const bookId = req.params.id;

    try {
        const toUpdateBook = await Book.findById(bookId);

        if(!toUpdateBook){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Book to update does not exist",
                "data": null
            });
        }

        const updatedTitle = req.body.title || null;
        const updatedAuthor = req.body.author || null;

        const updatedSummary = req.body.summary || toUpdateBook.summary;

        if(!updatedTitle && !updatedAuthor && (updatedSummary === toUpdateBook.summary)){
            return res.send({
                "success": true,
                "error_code": 200,
                "message": "Nothing provided to update, so book details remain same",
                "data": toUpdateBook
            });
        }

        if(updatedTitle && updatedAuthor && updatedSummary){
            const nothingUpdated = await Book.findOne({
                title: updatedTitle,
                author: updatedAuthor,
                summary: updatedSummary
            });


            if(nothingUpdated){
                return res.send({
                    "success": true,
                    "error_code": 200,
                    "message": "Nothing to update, every detail is same",
                    "data": nothingUpdated
                });
            }
        }

        if(updatedTitle){
            if(updatedAuthor){
                const alreadyExists = await Book.findOne({
                    title: updatedTitle,
                    author: updatedAuthor
                });

                if(alreadyExists){
                    return res.send({
                        "success": false,
                        "error_code": 400,
                        "message": "Given updated details already exists, cannot duplicate them",
                        "data": null
                    });
                }

                toUpdateBook.title = updatedTitle;
                toUpdateBook.author = updatedAuthor;
                toUpdateBook.summary = updatedSummary;

                await toUpdateBook.save();

                return res.send({
                    "success": true,
                    "error_code": 200,
                    "message": "Book details updated successfully",
                    "data": toUpdateBook
                });
            }

            const allBooksByAuthor = await Book.find({
                author: toUpdateBook.author
            });

            allBooksByAuthor.map((book) => {
                if(book.title === updatedTitle){
                    return res.send({
                        "success": false,
                        "error_code": 400,
                        "message": "Title to updated already exists for this author",
                        "data": null
                    });
                }
            });

            toUpdateBook.title = updatedTitle;
            toUpdateBook.author = toUpdateBook.author;
            toUpdateBook.summary = updatedSummary;

            await toUpdateBook.save();

            return res.send({
                "success": true,
                "error_code": 200,
                "message": "Book details updated successfully",
                "data": toUpdateBook
            });
        }

        else{
            if(updatedAuthor){
                
                const allBooksByTitle = await Book.find({
                    title: toUpdateBook.title
                });

                allBooksByTitle.map((book) => {
                    if(book.author === updatedAuthor){
                        return res.send({
                            "success": false,
                            "error_code": 400,
                            "message": "Author to updated already exists for this Title",
                            "data": null
                        });
                    }
                });

                toUpdateBook.title = toUpdateBook.title;
                toUpdateBook.author = updatedAuthor;
                toUpdateBook.summary = updatedSummary;

                await toUpdateBook.save();

                return res.send({
                    "success": true,
                    "error_code": 200,
                    "message": "Book details updated successfully",
                    "data": toUpdateBook
                });
            }

            toUpdateBook.title = toUpdateBook.title;
            toUpdateBook.author = toUpdateBook.author;
            toUpdateBook.summary = updatedSummary;

            await toUpdateBook.save();

            return res.send({
                "success": true,
                "error_code": 200,
                "message": "Book details updated successfully",
                "data": toUpdateBook
            });
        }

    } catch (err) {
        return res.send({
            "success": false,
            "error_code": 500,
            "message": err.message,
            "data": null
        });
    }
};

// Delete a book by (Author & Title) or ISBN
const deleteBookByDetails = async (req,res) => {
    const bookTitle = req.body.title || null;
    const bookAuthor = req.body.author || null;

    const bookISBN = req.body.ISBN || null;

    try {
        if(!bookISBN){
            if(!bookTitle || !bookAuthor){
                return res.send({
                    "success": false,
                    "error_code": 400,
                    "message": "Unable to delete, Either give Book ISBN or Book author & title",
                    "data": null
                });
            }

            const toDeleteBook = await Book.findOne({
                title: bookTitle,
                author: bookAuthor
            });

            if(!toDeleteBook){
                return res.send({
                    "success": false,
                    "error_code": 400,
                    "message": "Book Does not exist",
                    "data": null
                });
            }

            await Book.deleteOne(toDeleteBook);

            return res.send({
                "success": true,
                "error_code": 200,
                "message": "Successfully deleted the book by title & author",
                "data": toDeleteBook
            });
        }

        if(bookISBN.length !== 13){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Invalid ISBN, ISBN should be of 13 digits and start with 978..",
                "data": null
            });
        }

        const toDeleteBook = await Book.findOne({
            ISBN: bookISBN
        });

        if(!toDeleteBook){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Book Does not exist",
                "data": null
            });
        }

        await Book.deleteOne(toDeleteBook);

        return res.send({
            "success": true,
            "error_code": 200,
            "message": "Successfully deleted the book by ISBN",
            "data": toDeleteBook
        });

    } catch (err) {
        return res.send({
            "success": false,
            "error_code": 500,
            "message": err.message,
            "data": null
        });
    }
};

// Delete book by Id
const deleteBookById = async (req,res) => {
    const bookId = req.params.id;

    try {
        const toDeleteBook = await Book.findById(bookId);

        if(!toDeleteBook){
            return res.send({
                "success": false,
                "error_code": 400,
                "message": "Book to delete does not exist",
                "data": null
            });
        }

        await Book.deleteOne(toDeleteBook);

        return res.send({
            "success": true,
            "error_code": 200,
            "message": "Successfully deleted the book",
            "data": toDeleteBook
        });

    } catch (err) {
        return res.send({
            "success": false,
            "error_code": 500,
            "message": err.message,
            "data": null
        });
    }
};


module.exports = {
    addNewBook,
    getAllBooks,
    getBookById,
    getBookByDetails,
    updateBookById,
    deleteBookById,
    deleteBookByDetails
}
