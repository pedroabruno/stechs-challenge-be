const express = require('express');
const app = express();
const modems = require('./cableModemsExample')
var cors = require('cors');

var allowedOrigins = ['http://localhost:3000','https://stechs-challenge-fe.vercel.app'];

const mongoose = require('mongoose')
const CableModem = require('./models/CableModem')
const uri = "mongodb+srv://pbruno:VvSZ2HaFfiHTmFWe@cluster0.ovhgudc.mongodb.net/stechs?retryWrites=true&w=majority&appName=cluster0";
mongoose.connect(uri)

app.use(express.json())
app.use(cors({
    origin: function(origin, callback){
      // allow requests with no origin 
      // (like mobile apps or curl requests)
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
    const nameFilterId = req.query.name
    const statusFilterId = req.query.status
    let cableModems = modems 
    cableModems = nameFilterId ? cableModems.filter(m => m.name === nameFilterId) : cableModems
    cableModems = statusFilterId ? cableModems.filter(m => m.status === statusFilterId) : cableModems
    CableModem.find({}).then(data=>res.json(data)).catch(e => console.log(e))
});

app.get("/cableModems/:id", (req, res) => {
    res.set({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    })
    const cableModemId = req.params.id
    res.json(modems.filter(m=>m.id === cableModemId)[0])
});

app.post("/cableModems", (req, res) => {
    const newModem = req.body
    const idNumber  = Math.floor(Math.random() * (999 - 1) ) + 1
    const cableModem = new CableModem({...newModem,id:idNumber});
      try {
        cableModem.save();
      } catch (error) {
        console.error(error);
      }    
    res.json(newModem)
})

app.put("/cableModems/:id", (req, res) => {
    const cableModemId = req.params.id
    const newCableModem = {id:cableModemId, ...req.body}
    res.json(newCableModem)
})

app.delete("/cableModems/:id", (req, res) => {
    const cableModemId = req.params.id
    CableModem.deleteOne({id:cableModemId}).then(data=>res.json(data)).catch(e => console.log(e))
})

app.listen(3001, () => console.log("Server ready on port 3001."));

module.exports = app;