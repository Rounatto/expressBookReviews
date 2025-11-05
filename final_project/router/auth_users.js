const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// Registered users will be stored here
let users = [];

/**
 * Check if username is valid (not already registered)
 * @param {string} username
 * @returns {boolean}
 */
const isValid = (username) => {
    for (let user of users) {
        if (user.username === username) {
            return false; // username déjà pris
        }
    }
    return true; // username disponible
};

/**
 * Check if username and password match
 * @param {string} username
 * @param {string} password
 * @returns {boolean}
 */
const authenticatedUser = (username, password) => {
    for (let user of users) {
        if (user.username === username && user.password === password) {
            return true;
        }
    }
    return false;
};


// ============================
// USER REGISTRATION
// ============================
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// ============================
// USER LOGIN
// ============================
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token and store in session
    let accessToken = jwt.sign({ username: username }, "access", { expiresIn: "1h" });
    req.session.authorization = { accessToken, username };

    return res.status(200).json({
        message: "Login successful",
        token: accessToken
    });
});

// ============================
// ADD or UPDATE REVIEW
// ============================
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(403).json({ message: "User not authenticated" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review content is required" });
    }

    // Create reviews object if it doesn't exist
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully" });
});

// ============================
// DELETE REVIEW
// ============================
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(403).json({ message: "User not authenticated" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    } else {
        return res.status(404).json({ message: "No review found for this user" });
    }
});

// Export functions and router
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
