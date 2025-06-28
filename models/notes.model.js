import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  file_name: { type: String, required: true },
  upload_date: { type: Date, default: Date.now }
});

export const Note = mongoose.model('Note', noteSchema);
