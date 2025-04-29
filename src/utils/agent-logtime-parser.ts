import { parseReport, TableInfo } from './report-parser';

const ignoredTabs: string[] = ['Cover Sheet', 'Agent Log Time'];
const tables: TableInfo[] = [
  {
    name: 'Agent Log Time Detail Records',
    headers: ['Start Time', 'End Time', 'Duration', 'Disposition'],
  },
  {
    name: 'Agent Pause Time Detail Records',
    headers: ['Start Time', 'End Time', 'Duration', 'Disposition'],
  },
  {
    name: 'Agent Partial Pause Time Detail Records',
    headers: ['Start Time', 'End Time', 'Duration', 'Queue', 'Disposition'],
  },
];
const ignoredTables = [
  'Agent Pause Time Reasons Details',
  'Agent Partial Pause Time Reasons Details',
];

export const parseAgentLogtimeReport = async (reportFilePath: string) => {
  const agentLogtimeJson = await parseReport(
    reportFilePath,
    ignoredTabs,
    tables,
    ignoredTables,
  );

  return agentLogtimeJson;
};
