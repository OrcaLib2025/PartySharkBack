import mongoose from 'mongoose';

export interface IProfile {
    aboutMe?: string;
    sex?: 'male' | 'female' | 'secret';
    country?: string;
    city?: string;
}

const profileSchema = new mongoose.Schema<IProfile>({
    aboutMe: { type: String, default: '' },
    sex: { type: String, enum: ['male', 'female', 'secret'], default: 'secret' },
    country: { type: String, default: '' },
    city: { type: String, default: '' },
});

export default profileSchema;
