const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const { default: axios } = require("axios");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn/:review", (req, res) => {
  const isbn = req.params.isbn;
  const userReview = req.params.review;
  const username = req.session.authorization.username;
  if(!username){
    return res.send("username not found");
  }
  if(!userReview){
    return res.send("review not found");
  }
  if(!isbn){
    return res.send("isbn not found");
  }
  if (!isbn || !userReview || !username) {
    return res.send("send all required data");
  }
  const book = books[isbn];
  const reviews = book.reviews;
  let arrayOfUsername = Array.from(Object.keys(reviews));
  if (arrayOfUsername.length > 0) {
    let usernameExist = arrayOfUsername.filter((review) => {
      return review === username;
    });
    if (usernameExist.length > 0) {
      reviews[usernameExist[0]] = userReview;
    } else {
      reviews[username] = userReview;
    }
  } else {
    reviews[username] = userReview;
  }
  return res.send({...reviews });
});
// delete authenticated user's review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const book = books[isbn];
  const reviews = book.reviews;
  delete reviews[username];
  return res.send(reviews);
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
