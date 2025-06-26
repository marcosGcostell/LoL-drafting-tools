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
  patch: {
    type: String,
    required: [true, 'A patch must be selected'],
  },
  createdAt: {
    type: Date,
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

counterListSchema.pre(/^find/, function (next) {
  this.select('-__v -_id -list._id');
  next();
});

export default mongoose.model('CounterList', counterListSchema);
