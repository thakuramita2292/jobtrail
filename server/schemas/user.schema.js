// server/schemas/user.schema.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  passwordHash: { type: String, required: true, minlength: 20, select: false },
  masterResume: { type: String, default: '', maxlength: 50000 },
}, {
  timestamps: true,
  collection: 'users'
});

userSchema.index({ createdAt: 1 });

export const User = mongoose.model('User', userSchema);
export const APPLICATION_STATUSES = ['Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Negotiating'];