import { Schema, Types, model } from 'mongoose';

export interface IParty {
    img?: string;
    title: string;
    description?: string;
    members?: Types.ObjectId[];
    geoPoint: number[];
    isActive: boolean;
    createdAt: Date;
    endDate: Date;
    timeSlots: {
        start: Date;
        end: Date;
    }[];
    maxMembers: number;
    membersCount: number;
    tags: string[];
    isPaid: boolean;
}

const partySchema = new Schema<IParty>({
    img: { type: String },
    title: { type: String, required: true },
    description: { type: String },
    members: [{ type: Types.ObjectId, ref: 'UserModel' }],
    geoPoint: { type: [Number], required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    timeSlots: [{
        start: { type: Date, required: true },
        end: { type: Date, required: true }
    }],
    maxMembers: { type: Number, required: true },
    membersCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    isPaid: { type: Boolean, default: false }
});

partySchema.pre('save', function(next) {
    this.membersCount = this.members?.length || 0;
    next();
});

const PartyModel = model<IParty>('PartyModel', partySchema);

export default PartyModel;
