const express = require('express');
let books = require("../booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Task 10: Get all books using async-await
public_users.get('/async', async function (req, res) {
    try {
        const getBooks = () => {
            return new Promise((resolve, reject) => {
                resolve(books);
            });
        };
        const allBooks = await getBooks();
        res.send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        res.status(500).json({message: "Error fetching books"});
    }
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});

// Task 11: Get book by ISBN using Promises
public_users.get('/isbn-promise/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByISBN = new Promise((resolve, reject) => {
        if(books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });

    getBookByISBN
        .then((book) => res.send(JSON.stringify(book, null, 4)))
        .catch((error) => res.status(404).json({message: error}));
});

// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
        if(books[isbn]["author"] === req.params.author) {
            booksbyauthor.push({"isbn": isbn,
                "title": books[isbn]["title"],
                "reviews": books[isbn]["reviews"]});
        }
    });
    res.send(JSON.stringify(booksbyauthor, null, 4));
});

// Task 12: Get books by author using Promises
public_users.get('/author-promise/:author', function (req, res) {
    const author = req.params.author;
    const getBooksByAuthor = new Promise((resolve, reject) => {
        let booksbyauthor = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if(books[isbn]["author"] === author) {
                booksbyauthor.push({"isbn": isbn,
                    "title": books[isbn]["title"],
                    "reviews": books[isbn]["reviews"]});
            }
        });
        if(booksbyauthor.length > 0) {
            resolve(booksbyauthor);
        } else {
            reject("No books found by this author");
        }
    });

    getBooksByAuthor
        .then((result) => res.send(JSON.stringify(result, null, 4)))
        .catch((error) => res.status(404).json({message: error}));
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
        if(books[isbn]["title"] === req.params.title) {
            booksbytitle.push({"isbn": isbn,
                "author": books[isbn]["author"],
                "reviews": books[isbn]["reviews"]});
        }
    });
    res.send(JSON.stringify(booksbytitle, null, 4));
});

// Task 13: Get books by title using Promises
public_users.get('/title-promise/:title', function (req, res) {
    const title = req.params.title;
    const getBooksByTitle = new Promise((resolve, reject) => {
        let booksbytitle = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if(books[isbn]["title"] === title) {
                booksbytitle.push({"isbn": isbn,
                    "author": books[isbn]["author"],
                    "reviews": books[isbn]["reviews"]});
            }
        });
        if(booksbytitle.length > 0) {
            resolve(booksbytitle);
        } else {
            reject("No books found with this title");
        }
    });

    getBooksByTitle
        .then((result) => res.send(JSON.stringify(result, null, 4)))
        .catch((error) => res.status(404).json({message: error}));
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;