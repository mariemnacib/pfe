import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPasswordEntry extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PasswordEntrySchema: Schema<IPasswordEntry> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    url: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

const PasswordEntry: Model<IPasswordEntry> =
  mongoose.models.PasswordEntry || mongoose.model<IPasswordEntry>('PasswordEntry', PasswordEntrySchema);

export default PasswordEntry;
