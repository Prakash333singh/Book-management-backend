// Function for generating the Book ISBN
function generateISBN() {
    const prefix = "978";
    const randomDigits = Math.random().toString().slice(2, 12);
    
    const isbn = prefix + randomDigits;
    return isbn;
}

module.exports = generateISBN;