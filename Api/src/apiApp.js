const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

require("./databaseConnection/conn");

const router = require("./routers/dataRouters");
app.use(router);

app.listen(port, () => {
    console.log(`App is Running at ${port}`);
})
