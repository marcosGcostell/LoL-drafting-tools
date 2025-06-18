import mongoose from 'mongoose';

const statSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
  stats: {
    winRatio: Number,
    PickRate: Number,
    BanRate: Number,
    Games: Number,
    roleRates: {
      top: Number,
      jungle: Number,
      middle: Number,
      botton: Number,
      support: Number,
    },
  },
});

statSchema.pre(/^find/, function (next) {
  this.select('-__v -_id');
  next();
});

export default mongoose.model('Stat', statSchema);
