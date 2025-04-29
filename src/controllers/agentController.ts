import { Request, Response, NextFunction } from 'express';
import { agents, Agent } from '../models/agent';
import { InboundCall, OutboundCall, QueueCall } from '../models/call';
import { Log, QueuePauseLog } from '../models/log';
import { AppError } from '../middlewares/errorHandler';

export const addCallToAgent = (agentUsername, agentCalls) => {
  const edditingAgent = agents.find(
    (agent) => agent.username === agentUsername,
  );
  if (edditingAgent) {
    loadCallsToAgent(edditingAgent, agentCalls);
  } else {
    const newAgent = createNewAgent(agentUsername, {}, agentCalls);
    agents.push(newAgent);
  }
};

export const addLogToAgent = (agentUsername, agentLogs) => {
  const edditingAgent = agents.find(
    (agent) => agent.username === agentUsername,
  );
  if (edditingAgent) {
    loadLogsToAgent(edditingAgent, agentLogs);
  } else {
    const newAgent = createNewAgent(agentUsername, agentLogs, {});
    agents.push(newAgent);
  }
};

function createNewAgent(
  agentUsername: string,
  agentLogs: object,
  agentCalls: object,
) {
  const newAgent: Agent = {
    username: agentUsername,
    logDetails: [],
    callDetails: [],
  };

  loadLogsToAgent(newAgent, agentLogs);
  loadCallsToAgent(newAgent, agentCalls);

  return newAgent;
}

function loadLogsToAgent(agent: Agent, agentLogs: object) {
  for (const [logType, logsArray] of Object.entries(agentLogs)) {
    logsArray.forEach((log) => {
      let startTime: Date | boolean;
      if (!log['Start Time']) {
        startTime = false;
      } else {
        startTime = parseDate(log['Start Time']);
      }

      let endTime: Date | boolean;
      if (!log['End Time']) {
        endTime = false;
      } else {
        endTime = parseDate(log['End Time']);
      }

      const duration: number = parseLogDuration(log['Duration']);
      const disposition: string = log['Disposition'];
      if (logType === 'Agent Log Time Detail Records') {
        const type: string = 'Log On';
        const newLog: Log = {
          type: type,
          startTime: startTime,
          endTime: endTime,
          duration: duration,
          disposition: disposition,
        };
        agent.logDetails.push(newLog);
      } else if (logType === 'Agent Pause Time Detail Records') {
        const type: string = 'Pause';
        const newLog: Log = {
          type: type,
          startTime: startTime,
          endTime: endTime,
          duration: duration,
          disposition: disposition,
        };
        agent.logDetails.push(newLog);
      } else if (logType === 'Agent Partial Pause Time Detail Records') {
        const type: string = 'Queue Pause';
        const queue: string = log['Queue'];
        const newLog: QueuePauseLog = {
          type: type,
          startTime: startTime,
          endTime: endTime,
          duration: duration,
          disposition: disposition,
          queue: queue,
        };
        agent.logDetails.push(newLog);
      }
    });
  }
}

function loadCallsToAgent(agent: Agent, agentCalls: object) {
  for (const [callType, callsArray] of Object.entries(agentCalls)) {
    callsArray.forEach((call) => {
      const date: Date = parseDate(call['Date']);
      const trunk: number = call['Trunk'];
      const callTime: number = parseCallTime(call['Call Time']);
      if (callType === 'Details - Queue Calls') {
        const type: string = 'Queue';
        const queue: string = call['Queue'];
        const callerId: number = call['Caller ID'];
        const exitReason: string = call['Exit Reason'];

        const newCall: QueueCall = {
          type: type,
          date: date,
          trunk: trunk,
          callTime: callTime,
          queue: queue,
          callerId: callerId,
          exitReason: exitReason,
        };

        agent.callDetails.push(newCall);
      } else if (callType === 'Details - Inbound Calls') {
        const type: string = 'Inbound';
        const source: string = call['Source'];
        const disposition: string = call['Disposition'];

        const newCall: InboundCall = {
          type: type,
          date: date,
          trunk: trunk,
          callTime: callTime,
          source: source,
          disposition: disposition,
        };

        agent.callDetails.push(newCall);
      } else if (callType === 'Details - Outbound Calls') {
        const type: string = 'Outbound';
        const destination: string = call['Destination'];
        const disposition: string = call['Disposition'];

        const newCall: OutboundCall = {
          type: type,
          date: date,
          trunk: trunk,
          callTime: callTime,
          destination: destination,
          disposition: disposition,
        };

        agent.callDetails.push(newCall);
      }
    });
  }
}

function parseDate(dateString: string) {
  const formatedDateString = dateString.replace(/\s/g, '');
  const monthString = formatedDateString.substring(0, 3);
  let month: number = 0;
  const day: number = +formatedDateString.substring(3, 5);
  const year: number = +formatedDateString.substring(5, 9);
  let hour: number = +formatedDateString.substring(9, 11);
  const minute: number = +formatedDateString.substring(12, 14);
  const meridiem = formatedDateString.substring(14, 16);
  if (meridiem === 'pm') {
    hour = hour + 12;
  }

  switch (monthString) {
    case 'Jan':
      month = 1;
      break;
    case 'Feb':
      month = 2;
      break;
    case 'Mar':
      month = 3;
      break;
    case 'Apr':
      month = 4;
      break;
    case 'May':
      month = 5;
      break;
    case 'Jun':
      month = 6;
      break;
    case 'Jul':
      month = 7;
      break;
    case 'Aug':
      month = 8;
      break;
    case 'Sep':
      month = 9;
      break;
    case 'Oct':
      month = 10;
      break;
    case 'Nov':
      month = 11;
      break;
    case 'Dec':
      month = 12;
      break;
  }

  const date = new Date(year, month, day, hour, minute);

  return date;
}

function parseCallTime(callTimeString: Date): number {
  const callHours = callTimeString.getUTCHours();
  const callMinutes = callTimeString.getUTCMinutes();
  const callSeconds = callTimeString.getUTCSeconds();
  return callHours * 3600 + callMinutes * 60 + callSeconds;
}

function parseLogDuration(logDurationString: string) {
  const durationArray = logDurationString.split(':');
  return +durationArray[0] * 3600 + +durationArray[1] * 60 + +durationArray[2];
}

// @desc  Get All Agents
// @route GET /api/agents
export const getAgents = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(agents);
  } catch (error) {
    next(error);
  }
};

// @desc  Get Agent by Username
// @route GET /api/agents/:username
export const getAgentByUsername = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const username = req.params.username;
    const agent = agents.find((agent) => agent.username === username);

    if (!agent) {
      const err: AppError = new Error(
        `An agent with the username ${username} was not found.`,
      );
      err.status = 404;
      return next(err);
    }
    res.status(200).send(agent);
  } catch (error) {
    next(error);
  }
};

export const deleteAgents = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deletedAgents = agents.splice(0, agents.length);
    res.json(deletedAgents);
  } catch (error) {
    next(error);
  }
};

// @desc  Delete Agent by username
// @route DELETE /api/agents/:username
export const deleteAgentByUsername = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const username = req.params.username;
    const agentIndex = agents.findIndex((agent) => agent.username === username);

    if (agentIndex === -1) {
      const err: AppError = new Error(
        `An agent with the username ${username} was not found.`,
      );
      err.status = 404;
      return next(err);
    }

    const deletedAgent = agents.splice(agentIndex, 1)[0];
    res.json(deletedAgent);
  } catch (error) {
    next(error);
  }
};
