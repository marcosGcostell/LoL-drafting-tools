import mongoose from 'mongoose';

const versionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'A version identifier is needed'],
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

export default mongoose.model('Version', versionSchema);
