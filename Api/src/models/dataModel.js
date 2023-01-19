const mongoose = require('mongoose');
const validator = require('validator');

const dataSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email already exists!"],
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error("Enter a Valid Email!");
            }
        }
    },
    phone: {
        type: Number,
        unique: [true, "P.No already exists!"],
        required: true,
        unique: true,
        min: 10
    },
    address: {
        type: String,
        required: true
    },
    image:{
        type: String
    }
});

const DataModel = new mongoose.model('Database', dataSchema);

//const DataModel = Database;
module.exports = DataModel;