const express = require('express');
const path = require('path');
var fs = require('fs');
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
        res.status(201).send("The following Data is Send to The Database : " + sendData);
    } catch (e) {
        res.status(404).send(e.message);
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
        res.status(500).send(e.message);
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
        res.status(500).send(e.message);
    }
});

//update data by patch
router.patch("/data/", upload.single('image'), async (req, res) => {
    try {
        const id = req.body.id;
        const idData = await DataModel.findById(id);

        if (id) {
            if(idData)
            {
            if (req.body.address || req.body.phone || req.body.email || req.body.name || req.body.image) {
                const updateData = await DataModel.findByIdAndUpdate(id, { $set: { address: req.body.address, phone: req.body.phone, email: req.body.email, name: req.body.name, image: req.body.image } }, {
                    new: true
                });
                res.status(201).send("Data is Updated : \n" + updateData);
            }
            else{
                res.status(400).send("Enter Valid Input field to be Updated for id : " + id);
            }
        }else{
            res.status(400).send("No matching Found in Database for id : " + id);
        }
        }
        else {
            res.status(400).send("Enter Valid id to be Updated!");
            return;
        }
    } catch (e) {
        res.status(400).send(e.message);
    }
});

//update data by patch with id in link
router.patch("/data/:id", upload.single('image'), async (req, res) => {
    try {
        const id = req.params.id;
        const idData = await DataModel.findById(id);

        if (id) {
            if(idData)
            {
            if (req.body.address || req.body.phone || req.body.email || req.body.name || req.body.image) {
                const updateData = await DataModel.findByIdAndUpdate(id, { $set: { address: req.body.address, phone: req.body.phone, email: req.body.email, name: req.body.name, image: req.body.image } }, {
                    new: true
                });
                res.status(201).send(updateData);
            }
            else {
                res.status(400).send("Enter Valid Input field to be Updated!");
                return;
            }
        }
        else{
            res.status(400).send("No matching Found in Database for id : " + id);
        }
        }
    }
    catch (e) {
        res.status(400).send(e.message);
    }
});


//delete data 
router.delete("/data/", upload.single('image'), async (req, res) => {
    try {
        const id = req.body.id;
        
        const tempDeleteID = await DataModel.findById(id);
        if (!tempDeleteID) {
            res.status(400).send("No Matching ID to be Deleted!");
            return;
        }

        //for delete image from local storage also
        var imageName = tempDeleteID.image;
        var filePath = path.join(__dirname,`../../public/images/${imageName}`);    
        fs.unlinkSync(filePath);

     const deleteData = await DataModel.findByIdAndDelete(id);
        if (!req.body.id) {
            res.status(400).send("Enter Valid ID to be Deleted!");
            return;
        }
        res.send("Data is Deleted for the id : " + deleteData.id);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

//delete data using id in link
router.delete("/data/:id", upload.single('image'), async (req, res) => {
    try {
        const id = req.params.id;

        const tempDeleteID = await DataModel.findById(id);
        if (!tempDeleteID) {
            res.status(400).send("No Matching ID to be Deleted!");
            return;
        }

        //for delete image from local storage also
        var imageName = tempDeleteID.image;
        var filePath = path.join(__dirname,`../../public/images/${imageName}`);    
        fs.unlinkSync(filePath);

        const deleteData = await DataModel.findByIdAndDelete(id);
        if (!req.params.id) {
            return res.status(400).send();
            return;
        }
        res.send("Data is Deleted for the id : " + deleteData.id);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;