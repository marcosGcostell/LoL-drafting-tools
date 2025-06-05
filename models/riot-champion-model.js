import mongoose from 'mongoose';
import { findAsObject } from './common/helpers.js';

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

export default mongoose.model('Champions', championSchema);
