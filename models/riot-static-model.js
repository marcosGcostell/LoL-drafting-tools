import mongoose from 'mongoose';
import { findAsObjectm, escapeRegex } from './utils/helpers.js';

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

riotStaticSchema.statics.isValid = async function (queryStr) {
  // use RegExp to make comparisons non case sensitive
  const query = new RegExp(`^${escapeRegex(queryStr)}$`, 'i');
  return await this.findOne({
    $or: [{ id: query }, { name: query }],
  });
};

export const RiotRole = mongoose.model('RiotRole', riotStaticSchema);
export const RiotRank = mongoose.model('RiotRank', riotStaticSchema);
