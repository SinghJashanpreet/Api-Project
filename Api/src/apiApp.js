const express = require('express');
const app = express();
//local hosting at 3000
const port = process.env.PORT || 3000;
//get understand if json data comes
app.use(express.json());

require("./databaseConnection/conn");

const router = require("./routers/dataRouters");
app.use(router);

app.listen(port, () => {
    console.log(`App is Running at ${port}`);
})
