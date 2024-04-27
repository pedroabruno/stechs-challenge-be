const express = require('express');
const app = express();
const modems = require('./cableModemsExample')
var cors = require('cors');

var allowedOrigins = ['http://localhost:3000','https://stechs-challenge-fe.vercel.app'];

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
    res.json(cableModems)
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
    res.json(newModem)
})

app.put("/cableModems/:id", (req, res) => {
    const cableModemId = req.params.id
    const newCableModem = {id:cableModemId, ...req.body}
    res.json(newCableModem)
})

app.delete("/cableModems/:id", (req, res) => {
    const cableModemId = req.params.id
    res.json(modems.filter(m=>m.id !== cableModemId))
})

app.listen(3001, () => console.log("Server ready on port 3001."));

module.exports = app;