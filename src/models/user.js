const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");

// Schema for general user information
const userSchema =new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email id");
            }
        }
    },
    number: {
        type: Number,
        required: true,
        minLength: 10 // Note: minLength validation is not applicable to type Number
    },
    Event: {
        type: String,
        required: true,
        minLength: 3
    },
    message: {
        type: String,
        required: true,
        minLength: 3
    }
});

// Model for general user information
module.exports = mongoose.model("User", userSchema);
