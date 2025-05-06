const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, // image URL
}, { timestamps: true });

module.exports = mongoose.model("News", NewsSchema);
