import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

import { riotRole, riotRank } from './riot-static-model.js';
import { ENCRYPT_STRENGTH } from './utils/config';
import {
  MAX_LIST_ITEMS,
  PICK_RATE_THRESHOLD,
} from '../client/js/common/config.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  userName: {
    type: String,
    unique: true,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  avatar: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: PASSWORD_MIN_LENGTH,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  createdAt: Date,
  config: {
    pickRateThreshold: { type: Number, default: PICK_RATE_THRESHOLD },
    maxListItems: { type: Number, default: MAX_LIST_ITEMS },
  },
  data: {
    primaryRole: String,
    secondaryRole: String,
    championPool: {
      top: { type: [String], default: [] },
      jungle: { type: [String], default: [] },
      middle: { type: [String], default: [] },
      bottom: { type: [String], default: [] },
      support: { type: [String], default: [] },
    },
  },
});

userSchema.pre('save', async function (next) {
  // Only run this function if password is modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, ENCRYPT_STRENGTH);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  console.log(candidatePassword, userPassword);
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.hasChangedPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

export default mongoose.model('User', userSchema);
