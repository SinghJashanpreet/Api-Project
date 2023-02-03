const mongoose = require('mongoose');
const validator = require('validator');
var uniqueValidator = require('mongoose-unique-validator');
/*
Fields in Schema
*id,*name,*email,*phone,*address,image
*/
const dataSchema = mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Id is required!"]
    },
    name: {
        type: String,
        required: [true, 'Name is required!'],
        minlength: 3
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
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
        required: [true, 'phone is required!'],
        min: [1111111111 , 'Phone is less than 10 digits'],
        max: [9999999999 , 'Phone is more than 10 digits']
    },
    address: {
        type: String,
        required: [true, 'Address is required!']
    },
    image: {
        type: String,
    }
});

dataSchema.plugin(uniqueValidator, { message: 'Entered {PATH} already exists! : {VALUE} ' });

//Creating model for further document creation
const DataModel = new mongoose.model('Database', dataSchema);

module.exports = DataModel;