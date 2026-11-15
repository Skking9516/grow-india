const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json({ limit: '15mb' }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection String (Configured with your username: admin and password: 04062006)
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:04062006@cluster0.j7cwnei.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Database connected successfully!'))
  .catch(err => console.error('❌ Database connection error:', err));

const AppDataSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  data: Object
});
const AppData = mongoose.model('AppData', AppDataSchema);

// API to load data from MongoDB
app.get('/api/load', async (req, res) => {
  try {
    let record = await AppData.findOne({ key: 'main_store' });
    res.json(record ? record.data : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to save data to MongoDB
app.post('/api/save', async (req, res) => {
  try {
    const { data } = req.body;
    await AppData.findOneAndUpdate(
      { key: 'main_store' },
      { data: data },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
