import mongoose from 'mongoose';
import profileSchema, { IProfile } from './profile.model';

export interface IUser extends mongoose.Document {
    email: string;
    isActivated: boolean;
    activationLink: string;
    username: string;
    password: string;
    roles: string[];
    profile: IProfile;
}

const userSchema = new mongoose.Schema<IUser>({
    email: { type: String, unique: true, required: true },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String, required: true },
    username: { type: String, required: false },
    password: { type: String, required: true },
    roles: [{ type: String, ref: 'RoleModel', default: ['USER'] }],
    profile: { type: profileSchema, default: () => ({}) },
});

const UserModel = mongoose.model<IUser>('UserModel', userSchema);

export default UserModel;
