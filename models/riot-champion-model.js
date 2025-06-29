import mongoose from 'mongoose';
import { findAsObject, escapeRegex } from './utils/helpers.js';

const championSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  riotId: {
    type: String,
    required: [true, 'Champions must have an id'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Champions must have a name'],
    unique: true,
    trim: true,
  },
  key: {
    type: Number,
    required: [true, 'Champions must have a key'],
    unique: true,
  },
  img: {
    type: String,
    required: [true, 'Champions must have an image path'],
    unique: true,
  },
  sprite: {
    file: {
      type: String,
      required: [true, 'Champions must have a sprite file'],
    },
    x: {
      type: Number,
      required: [true, 'Champions must have a sprite coords'],
    },
    y: {
      type: Number,
      required: [true, 'Champions must have a sprite coords'],
    },
    w: {
      type: Number,
      required: [true, 'Champions must have a sprite coords'],
    },
    h: {
      type: Number,
      required: [true, 'Champions must have a sprite coords'],
    },
  },
  version: {
    type: String,
    required: [true, 'Champions must have an image path'],
  },
});

championSchema.pre(/^find/, function (next) {
  this.select('-_id -__v');
  next();
});

championSchema.statics.findAsObject = findAsObject;

championSchema.statics.replaceFromObject = async function (champions) {
  const data = Object.values(champions);
  await this.deleteMany();
  await this.create(data);
};

championSchema.statics.isValid = async function (champion) {
  // use RegExp to make comparisons non case sensitive
  const query = new RegExp(`^${escapeRegex(champion)}$`, 'i');
  return await this.findOne({
    $or: [{ riotId: query }, { id: query }, { name: query }],
  });
};

export default mongoose.model('Champions', championSchema);
