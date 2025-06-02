import mongoose from 'mongoose';

const versionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'A version identifier is needed'],
    unique: true,
    trim: true,
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
});

export default mongoose.model('Version', versionSchema);
