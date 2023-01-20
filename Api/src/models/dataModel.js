const mongoose = require('mongoose');
const validator = require('validator')
/*
Fields in Schema
*id,*name,*email,*phone,*address,image
*/
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
    image: {
        type: String
    }
});

//Creating model for further document creation
const DataModel = new mongoose.model('Database', dataSchema);

module.exports = DataModel;