import Router from 'koa-router';
import { PartyController } from '../controllers/party.controller';

const partyController = new PartyController();

const partyRouter = new Router();

partyRouter.post('/', partyController.createParty);
partyRouter.get('/party-by-id/:id', partyController.getParty);
partyRouter.get('/all-parties', partyController.getAllParties);
partyRouter.post('/:id/members', partyController.addMemberToParty);

export default partyRouter;
