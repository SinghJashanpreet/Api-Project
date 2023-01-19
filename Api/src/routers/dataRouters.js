const express = require('express');
const router = new express.Router();
const DataModel = require("../models/DataModel");
const multer = require("multer");
const app = express();
app.use(express.static('public'));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../public/images')
    },
    filename: function (req, file, cb) {
      const uniqueName = new Date().getHours() +'-'+ new Date().getMinutes() +'-'+ new Date().getSeconds();
      cb(null, file.fieldname + '-' + uniqueName + '.jpg')
    }
  });
  
  const upload = multer({ storage: storage })


//const upload = multer({ dest: '../public/images' });

// router.post("/data",upload.single('image'),async(req,res)=>{
//     try{
//         res.status(201).send("Image Uploaded Successfully..");
//     }catch(e){
//         res.status(500).send(e);
//     }
// });

const middleware = (req,res,next) => {
    //console.log(`Hello`);
    next();
}

router.post("/data",middleware, upload.single('image'), async (req, res) => {
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
router.get("/data",middleware, upload.single('image'), async (req, res) => {
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

//get particular user data by get method using id
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
            //console.log(req.body.image);
            if (req.body.address || req.body.phone || req.body.email || req.body.name || req.body.image) {
                const updateData = await DataModel.findByIdAndUpdate(id, { $set: { address: req.body.address, phone: req.body.phone, email: req.body.email, name: req.body.name ,image: req.body.image} }, {
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

router.patch("/data/:id", upload.single('image'), async (req, res) => {
    try {
        const id = req.params.id;
        if (id) {
            if (req.body.address || req.body.phone || req.body.email || req.body.name|| req.body.image) {
                const updateData = await DataModel.findByIdAndUpdate(id, { $set: { address: req.body.address, phone: req.body.phone, email: req.body.email, name: req.body.name ,image: req.body.image } }, {
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