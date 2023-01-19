const mongoose = require('mongoose');
const DbLink = `mongodb+srv://2018919:9198102@cluster0.ahc3t9m.mongodb.net/apiData?retryWrites=true&w=majority`;
//mongodb+srv://2018919:9198102@cluster0.ahc3t9m.mongodb.net/apiData?retryWrites=true&w=majority
//mongodb://localhost:27017/api_testing
mongoose.set('strictQuery', false);
mongoose.connect(DbLink, {
useUnifiedTopology:true
}).then(() => {
    console.log("Database Connection Established!");
}).catch((err) => {
    console.log(`No DataBase Connection! ${err}`);
});