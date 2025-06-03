import mongoose from 'mongoose';

const counterListSchema = new mongoose.Schema({
  champion: {
    type: String,
    required: [true, 'A champion must be selected'],
  },
  lane: {
    type: String,
    required: [true, 'A lane must be selected'],
  },
  rank: {
    type: String,
    required: [true, 'A rank must be selected'],
  },
  vslane: {
    type: String,
    required: [true, 'A lane vs lane must be selected'],
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
  list: [
    {
      name: String,
      winRatio: Number,
      delta1: Number,
      delta2: Number,
    },
  ],
});

export default mongoose.model('CounterList', counterListSchema);
