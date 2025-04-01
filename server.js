const express = require('express')
require('dotenv').config();
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = process.env.PORT;
const connectDB = require('./dbLayer/dbConnection')
const cors = require('cors');
const mainRouter= require("./routers/indexRouter")

const corsOptions = {
    origin: "*",
    methods: ["GET, POST, PUT, DELETE, OPTIONS, PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

connectDB();

app.get('/', async(req, res)=>{
    try{
        res.send('Welcome to API');
    } catch(err){
        console.log(err);
    }
})

app.use('/api', mainRouter);

app.listen(port, (err)=>{
    if (err) throw err;
    console.log(`Server is running on port ${port}`);
})