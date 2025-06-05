import mongoose from 'mongoose';

const versionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'A version identifier is needed'],
    unique: true,
    trim: true,
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
});

versionSchema.statics.replaceFromString = async function (version) {
  await this.deleteMany();
  await this.create({
    id: version,
    createdAt: new Date().toISOString(),
  });
  console.log(`Version saved. id: ${version} ✅`);
  return version;
};

export default mongoose.model('Version', versionSchema);
