// const mongoose = require('mongoose');

// const plugSchema = new mongoose.Schema({
//   name: String,
//   ip: String,
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ← important!
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Plug', plugSchema);


// // merge this 


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const energySchema = new Schema({
  TotalStartTime: { type: String },
  Total: { type: Number },
  Yesterday: { type: Number },
  Today: { type: Number },
  Power: { type: Number },
  Voltage: { type: Number },
  Current: { type: Number }
}, { _id: false });   // embedded energy object (not a subdocument collection)

const plugSchema = new Schema({
  name: { type: String, required: true },
  ip: { type: String, required: true },
  status: { type: Boolean, default: false },   // 1 n 0
  energy: energySchema,                        // embedded energy info
  user: { type: Schema.Types.ObjectId, ref: 'User' }  // owner reference
}, { timestamps: true });

module.exports = mongoose.model('Plug', plugSchema);