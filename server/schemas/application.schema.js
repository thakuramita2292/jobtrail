// server/schemas/application.schema.js
import mongoose from 'mongoose';
import { APPLICATION_STATUSES } from './user.schema.js';

const interviewSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: { type: String, enum: ['Phone Screen', 'Technical Round', 'HR Round', 'Final Round', 'Other'], required: true },
  scheduledAt: { type: Date, required: true },
  completedAt: { type: Date, default: null },
  feedback: { type: String, default: '', maxlength: 5000 },
  interviewer: { type: String, default: '', maxlength: 200 },
  notes: { type: String, default: '', maxlength: 5000 },
}, { _id: true, timestamps: false });

const noteSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  content: { type: String, required: true, maxlength: 5000 },
}, { _id: true, timestamps: true });

const statusHistorySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  status: { type: String, enum: APPLICATION_STATUSES, required: true },
  at: { type: Date, required: true, default: Date.now },
  notes: { type: String, default: '', maxlength: 1000 },
}, { _id: true, timestamps: false });

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  company: { type: String, required: true, trim: true, maxlength: 200 },
  role: { type: String, required: true, trim: true, maxlength: 200 },
  location: { type: String, required: true, trim: true, maxlength: 200 },
  status: {
    type: String,
    enum: { values: APPLICATION_STATUSES, message: '{VALUE} is not a valid status' },
    default: 'Wishlist',
    required: true,
    index: true
  },
  jobUrl: { type: String, default: '', trim: true, maxlength: 2048 },
  source: { type: String, enum: { values: ['LinkedIn', 'Indeed', 'Company Website', 'Referral', 'Other'] }, default: 'Other' },
  appliedDate: { type: Date, required: true, default: Date.now },
  jobDescription: { type: String, default: '', maxlength: 10000 },
  interviews: { type: [interviewSchema], default: [] },
  notes: { type: [noteSchema], default: [] },
  history: { type: [statusHistorySchema], default: [] },
}, { timestamps: true, collection: 'applications' });

// Compound indexes
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ userId: 1, appliedDate: -1 });
applicationSchema.index({ createdAt: 1 });

export const Application = mongoose.model('Application', applicationSchema);
