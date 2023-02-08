const express = require('express');
const path = require('path');
var fs = require('fs');
const router = new express.Router();
const app = express();
app.use(express.static('public'));
//getting model
const DataModel = require("../models/DataModel");
const multer = require("multer");
const { send } = require('process');

//For Generating an ID
const uuid = require("uuid").v4;



//for error formatting
const errorFormatter = e =>{
    var errObj = {};
    //for refining output
    var allE = e.substring(e.indexOf(':')+1).trim().replace(/\n/g,"").replace(/{/g,"").replace(/}/g,"").replace("  ","");
    
    var allEArry = allE.split(',').map(er=>er.trim());
    allEArry.forEach(err => {
        const [key,value] = err.split(':').map(er=>er.trim());
        errObj[key] = value;
    });
    return errObj;
}
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
        const imgName = req.file;
        if(!imgName){
            const user = new DataModel({
                _id: uuid(),
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address
            });
            const sendData = await user.save();
            res.status(201).send({
                staus: true,
                message:"The following data is send to Database ",
                Data:errorFormatter(`: ${sendData}`)
            });
        }
        else 
        {
            const user = new DataModel({
                _id: uuid(),
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                image: req.file.filename
            });
            const sendData = await user.save();
            res.status(201).send({
                staus: true,
                message:"The following data is send to Database ",
                Data:errorFormatter(`: ${sendData}`)
            });
        }
    } catch (e) {   
        //console.log(e);
        res.status(404).send({
            staus: false,
            message:errorFormatter(e.message)
        });
    }
});

//get all the data by get method
router.get("/data", middleware, upload.single('image'), async (req, res) => {
    try {
        const id = req.body.id || req.query.id;
        if (!id) {
            const getData = await DataModel.find();
            res.status(200).send(getData);
        }
        else {
            const getData = await DataModel.findById(id);
            if(!getData){
            res.status(500).send({
                staus: false,
                message:errorFormatter(`: Data is not Available in Database For Id : ${id}`)
            });}
            else
            res.status(200).send(getData);
        }
    } catch (e) {
        res.status(500).send({
           staus: false,
            message:errorFormatter(e.message)
        });
    }
});

//get particular user data by get method using id in link
router.get("/data/:id", upload.single('image'), async (req, res) => {
    try {
        const id = req.params.id;
        const getData = await DataModel.findById(id);
        if (!req.params.id)
            return res.status(404).send();
        res.status(200).send(getData);
    } catch (e) {
        res.status(500).send({
           staus: false,
            message:errorFormatter(e.message)
        });
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
                const updateData = await DataModel.findByIdAndUpdate(id, { $set: { address: req.body.address, phone: req.body.phone, email:  req.body.email, name: req.body.name, image: req.body.image } }, {
                    new: true
                });
                res.status(201).send({
                    staus: true,
                    message:"Data is Updated",
                    Data:errorFormatter(`: ${updateData}`)
                });
            }
            else{
                res.status(400).send({
                    staus: false,
                     message:errorFormatter(`: Enter Valid Input field to be Updated for id : ${id}`)
                 });
            }
        }else{
            res.status(400).send({
                staus: false,
                 message:errorFormatter(`: No matching Found in Database for id : ${id}`)
             });
        }
        }
        else {
            res.status(400).send({
                staus: false,
                 message:errorFormatter(` : Enter Valid id to be Updated! : `)
             });
            return;
        }
    } catch (e) {
        res.status(400).send({
           staus: false,
            message:errorFormatter(e.message)
        });
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
                res.status(201).send({
                    staus: true,
                    message:"Data is Updated",
                    Data:errorFormatter(`: ${updateData}`)
                });
            }
            else {
                res.status(400).send({
                    staus: false,
                     message:errorFormatter(`: Enter Valid Input field to be Updated for id : ${id}`)
                 });
                return;
            }
        }
        else{
            res.status(400).send({
                staus: false,
                 message:errorFormatter(`: No matching Found in Database for id : ${id}`)
             });
        }
        }
    }
    catch (e) {
        res.status(400).send({
           staus: false,
            message:errorFormatter(e.message)
        });
    }
});


//delete data 
router.delete("/data/", upload.single('image'), async (req, res) => {
    try {
        const id = req.body.id;
        
        const tempDeleteID = await DataModel.findById(id);
        if (!tempDeleteID) {
            res.status(400).send({
                staus: false,
                 message:errorFormatter(`: No Matching ID to be Deleted! : ${id}`)
             });
            return;
        }

        //for delete image from local storage also
        var imageName = tempDeleteID.image;
        var filePath = path.join(__dirname,`../../public/images/${imageName}`);    
  //      fs.unlinkSync(filePath);

     const deleteData = await DataModel.findByIdAndDelete(id);
        if (!req.body.id) {
            res.status(400).send({
                staus: false,
                 message:errorFormatter(`: Enter Valid ID to be Deleted! : ${id}`)
             });
            return;
        }
        res.status(201).send({
            staus: true,
            message:"Data is Deleted for the id",
            Data:errorFormatter(`: ${deleteData}`)
        });
    } catch (e) {
        res.status(500).send({
           staus: false,
            message:errorFormatter(e.message)
        });
    }
});

//delete data using id in link
router.delete("/data/:id", upload.single('image'), async (req, res) => {
    try {
        const id = req.params.id;

        const tempDeleteID = await DataModel.findById(id);
        if (!tempDeleteID) {
            res.status(400).send({
                staus: false,
                 message:errorFormatter(`: No Matching ID to be Deleted! : ${id}`)
             });
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
        res.status(201).send({
            staus: true,
            message:"Data is Deleted for the id",
            Data:errorFormatter(`: ${deleteData}`)
        });
    } catch (e) {
        res.status(500).send({
           staus: false,
            message:errorFormatter(e.message)
        });
    }
});

module.exports = router;