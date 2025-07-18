import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

import { dateNowToISO } from './utils/helpers.js';
import { ENCRYPT_STRENGTH, PASSWORD_MIN_LENGTH } from './utils/config.js';
import {
  MAX_LIST_ITEMS,
  PICK_RATE_THRESHOLD,
} from '../client/src/utils/config.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  username: {
    type: String,
    required: [true, 'Please tell us your user name!'],
  },
  usernameToLower: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
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
    required: [
      function () {
        return this.isNew || this.isModified('password');
      },
      'Please confirm your password',
    ],
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
    primaryRole: { type: String, default: '' },
    secondaryRole: { type: String, default: '' },
    rank: { type: String, default: 'all' },
    patch: { type: String, default: '' },
    championPool: {
      top: { type: [String], default: [] },
      jungle: { type: [String], default: [] },
      middle: { type: [String], default: [] },
      bottom: { type: [String], default: [] },
      support: { type: [String], default: [] },
    },
  },
});

userSchema.pre('validate', function (next) {
  if (this.isModified('username')) {
    this.usernameToLower = this.username?.toLowerCase();
  }
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, ENCRYPT_STRENGTH);
  this.passwordConfirm = undefined;
  this.passwordChangedAt = dateNowToISO(1000);
  next();
});

userSchema.pre(/^find/, function (next) {
  this.select('-__v');
  next();
});

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.hasChangedPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.statics.isValidEmail = function (email) {
  return validator.isEmail(email);
};

export default mongoose.model('User', userSchema);
