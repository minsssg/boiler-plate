const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://minssg:i10vem0^g0db@boilerplate.0neebxi.mongodb.net/?retryWrites=true&w=majority').then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err));

//mongodb+srv://minssg:<password>@boilerplate.0neebxi.mongodb.net/?retryWrites=true&w=majority

app.get('/', (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}`));