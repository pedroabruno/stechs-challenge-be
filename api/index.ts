const express = require('express');
const app = express();
var cors = require('cors');

var allowedOrigins = ['http://localhost:3000','https://stechs-challenge-fe.vercel.app'];

const mongoose = require('mongoose')
const CableModem = require('./models/CableModem')
const uri = "mongodb+srv://pbruno:VvSZ2HaFfiHTmFWe@cluster0.ovhgudc.mongodb.net/stechs?retryWrites=true&w=majority&appName=cluster0";
mongoose.connect(uri)

app.use(express.json())
app.use(cors({
    origin: function(origin, callback){
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  }));

app.get("/cableModems", (req, res) => {
    res.set({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    })
    const limit = req.query.limit
    const offset = req.query.offset
    const filters = {...(req.query.name && {
        name : {'$regex': new RegExp("^" + decodeURIComponent(req.query.name).toLowerCase(), "i")} }), 
        ...(req.query.status && {status : req.query.status})
    }
    CableModem.find(filters).skip(offset).limit(limit)
        .then(documents=>{
            CableModem.find(filters).count()
            .then(count=>{
                res.json({documents, count})
            })
        })
        .catch(e => console.log(e))

});

app.get("/cableModems/:id", (req, res) => {
    res.set({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    })
    const cableModemId = req.params.id
    CableModem.findById(cableModemId).then(data=>res.json(data)).catch(e => console.log(e))
});

app.post("/cableModems", (req, res) => {
    const newModem = req.body
    const cableModem = new CableModem({...newModem});
    CableModem.exists({name:req.body.name})
        .then(d=>{
            if (d){
                console.log('existing item')
                res.status(400);
                res.send('');
            }else{ 
                try {
                    cableModem.save();
                    res.status(201);
                    res.send('item created');
                } catch (error) {
                    console.error(error);
                    res.status(400);
                }   
            } 
        }).catch(e => console.log(e))
})

app.put("/cableModems/:id", (req, res) => {
    const cableModemId = req.params.id
    CableModem.findByIdAndUpdate(cableModemId, req.body).then(data=>res.json(data)).catch(e => console.log(e))
})

app.delete("/cableModems/:id", (req, res) => {
    const cableModemId = req.params.id
    CableModem.findByIdAndDelete(cableModemId).then(data=>res.json(data)).catch(e => console.log(e))
})

app.listen(3001, () => console.log("Server ready on port 3001."));

module.exports = app;