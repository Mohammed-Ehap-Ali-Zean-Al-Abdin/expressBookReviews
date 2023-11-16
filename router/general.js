const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(Array.from(Object.values(books)))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(!isbn){
    return res.status(404).send("no isbn sent")
  }
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  if(!author){
    return res.status(404).send("no author sent")
  }
  const booksArray = Array.from(Object.values(books))
  const filteredBooks = booksArray.filter((book)=>{
    return book.author === author;
  });
  if(filteredBooks.length===0){
    return res.status(404).send("no books found")
  }
  res.send(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  if(!title){
    return res.status(404).send("no author sent")
  }
  const booksArray = Array.from(Object.values(books))
  const filteredBooks = booksArray.filter((book)=>{
    return book.title === title;
  });
  if(filteredBooks.length===0){
    return res.status(404).send("no books found")
  }
  res.send(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(!isbn){
    return res.status(404).send("no isbn sent");
  }
  const book = books[isbn];
  res.send(book.reviews)
});

module.exports.general = public_users;
