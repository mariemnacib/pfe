import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export interface IGroup extends Document {
  groupName: string;
  admin: IUser['_id'];
  users: IUser['_id'][];
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema: Schema<IGroup> = new Schema(
  {
    groupName: { type: String, required: true, unique: true },
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Group: Model<IGroup> = mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema);

export default Group;
