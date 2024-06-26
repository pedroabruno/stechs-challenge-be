const mongoose = require('mongoose')
const { Schema, model } = mongoose;
const cableModemSchema = new Schema({
    name: String,
    description: String,
    status: String,
    validSince: String,
    tags: [String]
  });

const CableModem = model('cablemodem', cableModemSchema);
module.exports = CableModem