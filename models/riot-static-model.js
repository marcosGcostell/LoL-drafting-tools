import mongoose from 'mongoose';
import { findAsObject } from './common/helpers.js';

// This is for a non schematic model of a collection
// const riotStaticSchema = new mongoose.Schema({}, { strict: false });

const riotStaticSchema = new mongoose.Schema({
  index: {
    type: Number,
    required: [true, 'Data needs an index'],
    unique: true,
  },
  id: {
    type: String,
    required: [true, 'A identifier is needed'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'A name is needed'],
  },
  img: {
    type: String,
    required: [true, 'A image file name is needed'],
  },
});

riotStaticSchema.pre(/^find/, function (next) {
  this.select('-_id -__v').sort('index');
  next();
});

riotStaticSchema.statics.findAsObject = findAsObject;

export const riotRole = mongoose.model('RiotRole', riotStaticSchema);
export const riotRank = mongoose.model('RiotRank', riotStaticSchema);
