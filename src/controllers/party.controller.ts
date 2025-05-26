import Koa, { Context } from 'koa';
import { PartyService } from '../service/party.service';
import { IParty } from '../models/party.model';

export class PartyController {
    private partyService: PartyService;

    constructor() {
        this.partyService = new PartyService();
    }

    public createParty = async (ctx: Koa.Context): Promise<void> => {
        try {
            const partyData: Omit<IParty, 'createdAt' | 'membersCount'> = {
                ...ctx.request.body,
                geoPoint: ctx.request.body.geoPoint || [0, 0],
                members: ctx.request.body.members || [],
                tags: ctx.request.body.tags || [],
            };

            const newParty = await this.partyService.createParty(partyData);

            ctx.status = 201;
            ctx.body = {
                success: true,
                data: newParty,
            };
        } catch (error: any) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: error.message || 'Ошибка при создании вечеринки',
            };
        }
    };

    public getParty = async (ctx: Context): Promise<void> => {
        try {
            const party = await this.partyService.getPartyById(ctx.params.id);

            if (!party) {
                ctx.status = 404;
                ctx.body = {
                    success: false,
                    message: 'Вечеринка не найдена',
                };
                return;
            }

            ctx.status = 200;
            ctx.body = {
                success: true,
                data: party,
            };
        } catch (error: any) {
            ctx.status = 500;
            ctx.body = {
                success: false,
                message: error.message || 'Ошибка при получении вечеринки',
            };
        }
    };

    public getAllParties = async (ctx: Context): Promise<void> => {
        try {
            const { active } = ctx.query;

            let filter: { isActive?: boolean } = {};
            if (active !== undefined) {
                filter.isActive = active === 'true';
            }

            const parties = await this.partyService.getAllParties(filter);

            ctx.status = 200;
            ctx.body = {
                success: true,
                data: parties,
            };
        } catch (error: any) {
            ctx.status = 500;
            ctx.body = {
                success: false,
                message: error.message || 'Ошибка при получении списка вечеринок',
            };
        }
    };
}