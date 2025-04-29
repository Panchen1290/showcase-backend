import { parseReport, TableInfo } from './report-parser';

const ignoredTabs: string[] = ['Cover Sheet', 'Agent Performance'];
const tables: TableInfo[] = [
  {
    name: 'Details - Queue Calls',
    headers: [
      'Date',
      'Queue',
      'Trunk',
      'Caller ID',
      'Call Time',
      'Exit Reason',
    ],
  },
  {
    name: 'Details - Inbound Calls',
    headers: ['Date', 'Trunk', 'Source', 'Call Time', 'Disposition'],
  },
  {
    name: 'Details - Outbound Calls',
    headers: ['Date', 'Trunk', 'Destination', 'Call Time', 'Disposition'],
  },
];
const ignoredTables = ['Agent Performance / Queue', 'Details - Internal Calls'];

export const parseAgentPerformanceReport = async (reportFilePath: string) => {
  const agentPerformanceJson = await parseReport(
    reportFilePath,
    ignoredTabs,
    tables,
    ignoredTables,
  );

  return agentPerformanceJson;
};
