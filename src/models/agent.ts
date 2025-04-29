import { Call } from './call';
import { Log } from './log';

export interface Agent {
  username: string;
  logDetails: Log[];
  callDetails: Call[];
}

export const agents: Agent[] = [];
