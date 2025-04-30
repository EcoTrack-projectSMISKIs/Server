const News = require("../models/News");

// 📄 Get all news
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➕ Add news (Admin)
exports.addNews = async (req, res) => {
  const { title, content, image } = req.body;
  try {
    const newPost = await News.create({ title, content, image });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✏️ Update news (Admin)
exports.updateNews = async (req, res) => {
  const { title, content, image } = req.body;
  try {
    const updated = await News.findByIdAndUpdate(
      req.params.id,
      { title, content, image },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ❌ Delete news (Admin)
exports.deleteNews = async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: "News deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};