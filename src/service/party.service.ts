import { Types } from 'mongoose';
import PartyModel, { IParty } from '../models/party.model';

export class PartyService {
    public async createParty(partyData: Omit<IParty, 'createdAt' | 'membersCount'>): Promise<IParty> {
        if (partyData.timeSlots && partyData.timeSlots.length > 0) {
            for (const slot of partyData.timeSlots) {
                if (slot.start >= slot.end) {
                    throw new Error('Время начала должно быть раньше времени окончания');
                }
            }
        }

        if (partyData.endDate && new Date(partyData.endDate) < new Date()) {
            throw new Error('Дата окончания не может быть в прошлом');
        }

        if (partyData.maxMembers && partyData.maxMembers <= 0) {
            throw new Error('Максимальное количество участников должно быть положительным числом');
        }

        const newParty = new PartyModel({
            ...partyData,
            membersCount: 0,
            isActive: partyData.isActive !== undefined ? partyData.isActive : true,
        });

        return await newParty.save();
    }

    public async getPartyById(id: string): Promise<IParty | null> {
        return PartyModel.findById(id).populate('members');
    }
}