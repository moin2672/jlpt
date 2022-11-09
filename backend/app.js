const express = require('express');
const mogoose = require("mongoose");


const userRoutes = require("./routes/users");
const contentRoutes = require("./routes/contents");
const lessonRoutes = require("./routes/lessons");

const app = express();

mogoose.connect("mongodb+srv://ajjumoin2672:"+process.env.MONGO_ALTAS_PW+"@cluster0.rhfy6pg.mongodb.net/jlptdb", { useNewUrlParser: true, useUnifiedTopology: true })
        .then(()=>{console.log("Connected to Database")})
        .catch(()=>{console.log("Db connection failed!")});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

//middleware
//Adding middleware to resolve CORS problem
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next()
});


app.use("/api/users",userRoutes);
app.use("/api/contents",contentRoutes);
app.use("/api/lessons",lessonRoutes);

app.use((req, res, next)=>{
    res.send('Hello From Express')
});

module.exports = app;