const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  new Promise((resolve, reject) => {
    if (!books) {
      reject(Error("no books found"));
    }
    resolve(Array.from(Object.values(books)));
  })
    .then((data) => {
      return res.send(data);
    })
    .catch((err) => {
      return res.send(err);
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (!isbn) {
      reject(Error("no isbn sent"));
    }
    resolve(books[isbn]);
  })
    .then((data) => {
      return res.send(data);
    })
    .catch((err) => {
      return res.send(err);
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  new Promise((resolve, reject) => {
    const author = req.params.author;
    if (!author) {
      reject(Error("no author sent"));
    }
    const booksArray = Array.from(Object.values(books));
    const filteredBooks = booksArray.filter((book) => {
      return book.author === author;
    });
    if (filteredBooks.length === 0) {
      resolve("no books found");
    }
    resolve(filteredBooks);
  })
    .then((data) => {
      return res.send(data);
    })
    .catch((err) => {
      return res.send(err);
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  new Promise((resolve, reject) => {
    const title = req.params.title;
    if (!title) {
      reject(Error("no title sent"));
    }
    const booksArray = Array.from(Object.values(books));
    const filteredBooks = booksArray.filter((book) => {
      return book.title === title;
    });
    if (filteredBooks.length === 0) {
      resolve("no books found");
    }
    resolve(filteredBooks);
  })
    .then((data) => {
      return res.send(data);
    })
    .catch((err) => {
      return res.send(err);
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(404).send("no isbn sent");
  }
  const book = books[isbn];
  res.send(book.reviews);
});

module.exports.general = public_users;
