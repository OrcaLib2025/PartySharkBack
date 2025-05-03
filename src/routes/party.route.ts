import Router from 'koa-router';
import { PartyController } from '../controllers/party.controller';

const partyController = new PartyController();

const partyRouter = new Router();

partyRouter.post('/', partyController.createParty);
partyRouter.get('/:id', partyController.getParty);

export default partyRouter;
