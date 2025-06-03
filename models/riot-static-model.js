import mongoose from 'mongoose';

const riotStaticSchema = new mongoose.Schema({}, { strict: false });

export default mongoose.model('RiotStatic', riotStaticSchema);
