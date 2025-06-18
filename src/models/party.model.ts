import { Schema, Types, model } from 'mongoose';

export interface IParty extends Document {
    id?: string;
    uid?: string;
    img?: string;
    title: string;
    description?: string;
    members?: { name: string; id: string }[];
    geoPoint: number[];
    isActive: boolean;
    createdAt: Date;
    endDate: Date | string;
    timeSlots: { start: Date | string; end: Date | string }[];
    maxMembers: number;
    membersCount: number;
    tags: string[];
    isPaid: boolean;
    author?: string;
}

const partySchema = new Schema<IParty>({
    uid: { type: String, required: true },
    img: { type: String, required: false },
    title: { type: String, required: true },
    description: { type: String, required: false },
    members: [
        {
            name: { type: String, required: true },
            id: { type: String, required: true },
        },
    ],
    geoPoint: { type: [Number], required: true, default: [0, 0] },
    isActive: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, required: true, default: Date.now },
    endDate: { type: String, required: true },
    timeSlots: [
        {
            start: { type: String, required: true },
            end: { type: String, required: true },
        },
    ],
    maxMembers: { type: Number, required: true },
    membersCount: { type: Number, required: true, default: 0 },
    tags: { type: [String], required: true, default: [] },
    isPaid: { type: Boolean, required: true, default: false },
    author: { type: String, required: false },
});

partySchema.pre('save', function (next) {
    this.membersCount = this.members?.length || 0;
    next();
});

const PartyModel = model<IParty>('PartyModel', partySchema);

export default PartyModel;
