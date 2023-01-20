const express = require('express');
const router = new express.Router();
const app = express();
app.use(express.static('public'));
//getting model
const DataModel = require("../models/DataModel");
const multer = require("multer");

//Giving image file new name and destinaion
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        const uniqueName = new Date().getHours() + '-' + new Date().getMinutes() + '-' + new Date().getSeconds();
        cb(null, file.fieldname + '-' + uniqueName + '.jpg')
    }
});

//Will store all data about image: newname, destination etc
const upload = multer({ storage: storage });

const middleware = (req, res, next) => {
    next();
}

//uploading data via post method
router.post("/data", middleware, upload.single('image'), async (req, res) => {
    try {
        const user = new DataModel({
            _id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            image: req.file.filename
        });
        const sendData = await user.save();
        res.status(201).send(sendData);
    } catch (e) {
        res.status(404).send(e);
    }
});

//get all the data by get method
router.get("/data", middleware, upload.single('image'), async (req, res) => {
    try {
        const id = req.body.id;
        if (!id) {
            const getData = await DataModel.find();
            res.status(201).send(getData);
        }
        else {
            const getData = await DataModel.findById(id);
            res.status(201).send(getData);
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

//get particular user data by get method using id in link
router.get("/data/:id", upload.single('image'), async (req, res) => {
    try {
        const id = req.params.id;
        const getData = await DataModel.findById(id);
        if (!req.params.id)
            return res.status(404).send();
        res.status(201).send(getData);
    } catch (e) {
        res.status(500).send(e);
    }
});

//update data by patch
router.patch("/data/", upload.single('image'), async (req, res) => {
    try {
        const id = req.body.id;

        if (id) {
            if (req.body.address || req.body.phone || req.body.email || req.body.name || req.body.image) {
                const updateData = await DataModel.findByIdAndUpdate(id, { $set: { address: req.body.address, phone: req.body.phone, email: req.body.email, name: req.body.name, image: req.body.image } }, {
                    new: true
                });
                res.status(201).send(updateData);
            }
        }
        else {
            res.status(400).send("Enter Valid Input field to be Updated!");
            throw new console.error("Enter Valid Id to Update Data!");
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

//update data by patch with id in link
router.patch("/data/:id", upload.single('image'), async (req, res) => {
    try {
        const id = req.params.id;
        if (id) {
            if (req.body.address || req.body.phone || req.body.email || req.body.name || req.body.image) {
                const updateData = await DataModel.findByIdAndUpdate(id, { $set: { address: req.body.address, phone: req.body.phone, email: req.body.email, name: req.body.name, image: req.body.image } }, {
                    new: true
                });
                res.status(201).send(updateData);
            }
        }
    }
    catch (e) {
        res.status(400).send(e);
    }
});


//delete data 
router.delete("/data/", upload.single('image'), async (req, res) => {
    try {
        const id = req.body.id;
        const deleteData = await DataModel.findByIdAndDelete(id);
        if (!req.body.id) {
            res.status(400).send("Enter Valid ID to be Deleted!");
        }
        res.send(deleteData);
    } catch (e) {
        res.status(500).send(e);
    }
});

//delete data using id in link
router.delete("/data/:id", upload.single('image'), async (req, res) => {
    try {
        const id = req.params.id;
        const deleteData = await DataModel.findByIdAndDelete(id);
        if (!req.params.id) {
            return res.status(400).send();
        }
        res.send(deleteData);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;