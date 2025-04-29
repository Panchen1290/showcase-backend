import { Router } from 'express';
import {
  getAgentByUsername,
  getAgents,
  deleteAgentByUsername,
  deleteAgents,
} from '../controllers/agentController';

const router = Router();

router.get('/', getAgents);
router.get('/:username', getAgentByUsername);
router.delete('/', deleteAgents);
router.delete('/:username', deleteAgentByUsername);

export default router;
