import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPasswordManagerAccessRequest extends Document {
  userId: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
}

const PasswordManagerAccessRequestSchema: Schema<IPasswordManagerAccessRequest> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    requestedAt: { type: Date, default: Date.now },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

const PasswordManagerAccessRequest: Model<IPasswordManagerAccessRequest> =
  mongoose.models.PasswordManagerAccessRequest ||
  mongoose.model<IPasswordManagerAccessRequest>('PasswordManagerAccessRequest', PasswordManagerAccessRequestSchema);

export default PasswordManagerAccessRequest;
