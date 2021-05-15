const express = require('express');
const app = express();
const PORT = 4000;
const mongoose = require('mongoose')
const {MONGOURI} = require('./keys')
//OKIBSyUjYV9Xw9vP

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true 
});

mongoose.connection.on('connected',() => {
    console.log("connected to mongo")
})

mongoose.connection.on('error',(err) => {
    console.log("connected to mongo",err)
})


require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'));
app.use(require('./routes/post'))

 
app.listen(PORT,() => {
    console.log("server is running At",PORT);
});

