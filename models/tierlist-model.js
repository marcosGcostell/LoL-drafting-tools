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
    type: Date,
    default: new Date().toISOString(),
  },
  list: [
    {
      name: String,
      roleRate: Number,
      winRatio: Number,
      pickRate: Number,
      banRate: Number,
    },
  ],
});

tierlistSchema.pre(/^find/, function (next) {
  this.select('-__v -_id -list._id');
  next();
});

export default mongoose.model('Tierlist', tierlistSchema);
