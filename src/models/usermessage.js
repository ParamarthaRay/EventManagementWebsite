const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");



// Schema for user authentication
const userSchemas = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Middleware for hashing passwords before saving
userSchemas.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// Model for user authentication
module.exports= mongoose.model("Users", userSchemas);

// Exporting both models

