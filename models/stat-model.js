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
    winRatio: {
      type: Number,
      required: [true, 'winRatio must be fetched'],
    },
    pickRate: {
      type: Number,
      required: [true, 'pickRate must be fetched'],
    },
    banRate: {
      type: Number,
      required: [true, 'banRate must be fetched'],
    },
    games: {
      type: Number,
      required: [true, 'Games must be fetched'],
    },
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
