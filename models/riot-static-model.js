import mongoose from 'mongoose';

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

export const riotRole = mongoose.model('RiotRole', riotStaticSchema);
export const riotRank = mongoose.model('RiotRank', riotStaticSchema);
