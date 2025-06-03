import mongoose from 'mongoose';

const tierlistSchema = new mongoose.Schema({
  lane: {
    type: String,
    required: [true, 'A lane must be selected'],
  },
  rank: {
    type: String,
    required: [true, 'A rank must be selected'],
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
  list: [
    {
      name: String,
      winRatio: Number,
      pickRate: Number,
      banRate: Number,
    },
  ],
});

export default mongoose.model('Tierlist', tierlistSchema);
