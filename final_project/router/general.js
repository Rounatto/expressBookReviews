const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios"); // used in client snippet below, OK to keep


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]){
    return res.status(200).send(JSON.stringify(books[isbn],null,4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filteredBooks = [];
  let keys = Object.keys(books);
  keys.forEach((key) => {
    if(books[key].author.toLowerCase() === author.toLowerCase()){
      filteredBooks.push(books[key]);
    }
  });
  if(filteredBooks.length > 0){
    return res.status(200).send(JSON.stringify(filteredBooks,null,4));
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filteredBooks = [];
  let keys = Object.keys(books);
  keys.forEach((key) => {
    if(books[key].title.toLowerCase() === title.toLowerCase()){
      filteredBooks.push(books[key]);
    }
  });
  if(filteredBooks.length > 0){
    return res.status(200).send(JSON.stringify(filteredBooks,null,4));
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]){
    return res.status(200).send(JSON.stringify(books[isbn].reviews,null,4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Task 10 - Get all books using async/await with Axios
public_users.get('/async/books', async (req, res) => {
    try {
        const response = await axios.get('https://rayan1mhalla-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Erreur lors de la récupération des livres",
            error: error.message
        });
    }
});

//task11
public_users.get('/promise/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    axios.get(`https://rayan1mhalla-5000.theianext-0-labs-prod-misc-tools-us-east-0.
    proxy.cognitiveclass.ai/isbn/${isbn}`)
        .then(response => {
            return res.status(200).json(response.data);
        })
        .catch(error => {
            return res.status(500).json({
                message: "Erreur lors de la récupération du livre par ISBN",
                error: error.message
            });
        });
});
// Task 12 - Get book details by Author using Async/Await with Axios
public_users.get('/async/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get('https://rayan1mhalla-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
        const books = response.data;
        // Chercher les livres qui correspondent à l’auteur
        const filteredBooks = Object.values(books).filter(book =>
            book.author.toLowerCase() === author.toLowerCase()
        );
        if (filteredBooks.length === 0) {
            return res.status(404).json({ message: "Aucun livre trouvé pour cet auteur" });
        }
        return res.status(200).json(filteredBooks);
    } catch (error) {
        return res.status(500).json({
            message: "Erreur lors de la récupération des livres par auteur",
            error: error.message
        });
    }
});

// Task 13 - Get book details by Title using Async/Await with Axios
public_users.get('/async/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        // Récupérer tous les livres via l’API (le lien de ton serveur)
        const response = await axios.get('https://rayan1mhalla-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
        const books = response.data;
        // Chercher les livres qui ont le titre correspondant
        const filteredBooks = Object.values(books).filter(book =>
            book.title.toLowerCase() === title.toLowerCase()
        );
        if (filteredBooks.length === 0) {
            return res.status(404).json({ message: "Aucun livre trouvé pour ce titre" });
        }
        return res.status(200).json(filteredBooks);
    } catch (error) {
        return res.status(500).json({
            message: "Erreur lors de la récupération des livres par titre",
            error: error.message
        });
    }
});


module.exports.general = public_users;