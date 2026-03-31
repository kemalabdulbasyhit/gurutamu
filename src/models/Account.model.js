import { string } from 'joi';
import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    createdBy: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    file: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: string,
      enum: ['submited'],
      trim: true,
    },
  },
  { timestamps: true }
);

// Index untuk mempercepat pencarian
accountSchema.index({ 'createdBy._id': 1 });

const Account = mongoose.model('Account', accountSchema, 'accounts');

export default Account;

