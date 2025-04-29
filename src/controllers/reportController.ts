import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { parseAgentPerformanceReport } from '../utils/agent-performance-parser';
import { parseAgentLogtimeReport } from '../utils/agent-logtime-parser';
import { addCallToAgent, addLogToAgent } from './agentController';
import { UploadedFile } from 'express-fileupload';
import { AppError } from '../middlewares/errorHandler';

const dataFolderPath = path.join(__dirname, '../', '../', 'data');

const agentPerformanceReportExcelFile = path.join(
  dataFolderPath,
  'Agent Performance Report.xlsx',
);

const logtimeReportExcelFile = path.join(dataFolderPath, 'Logtime Report.xlsx');

// @desc  Upload Agent Performance Report Data
// @route POST /api/reports/uploadAgentPerformance
export const uploadAgentPerformanceReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!fs.existsSync(dataFolderPath)) {
      fs.mkdirSync(dataFolderPath);
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      const err: AppError = new Error('No files were uploaded');
      err.status = 404;
      return next(err);
    }

    const report = req.files.reportFile as UploadedFile;

    await report.mv(agentPerformanceReportExcelFile, async function (err) {
      if (err) return res.status(500).send(err);
      await loadAgentPerformanceReport();
      fs.unlinkSync(agentPerformanceReportExcelFile);
      res.json({ message: 'Agent Performance Uploaded!' });
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Upload Logtime Report
// @route POST /api/reports/uploadLogtime
export const uploadLogtimeReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!fs.existsSync(dataFolderPath)) {
      fs.mkdirSync(dataFolderPath);
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      const err: AppError = new Error('No files were uploaded');
      err.status = 404;
      return next(err);
    }

    const report = req.files.reportFile as UploadedFile;

    await report.mv(logtimeReportExcelFile, async function (err) {
      if (err) return res.status(500).send(err);
      await loadLogtimeReport();
      fs.unlinkSync(logtimeReportExcelFile);
      res.json({ message: 'Logtime Uploaded!' });
    });
  } catch (error) {
    next(error);
  }
};

async function loadAgentPerformanceReport() {
  console.log(`Reading file from: ${agentPerformanceReportExcelFile}`);
  const agentPerformanceJson = await parseAgentPerformanceReport(
    agentPerformanceReportExcelFile,
  );
  parseAgentsCalls(agentPerformanceJson);
}

async function loadLogtimeReport() {
  console.log(`Reading file from: ${logtimeReportExcelFile}`);
  const agentLogtimeJson = await parseAgentLogtimeReport(
    logtimeReportExcelFile,
  );
  parseAgentsLogs(agentLogtimeJson);
}

const parseAgentsCalls = (agentPerformanceJson: object) => {
  for (const [agentUsername, agentCalls] of Object.entries(
    agentPerformanceJson,
  )) {
    addCallToAgent(agentUsername, agentCalls);
  }
};

const parseAgentsLogs = (agentLogtimeJson: object) => {
  for (const [agentUsername, agentLogs] of Object.entries(agentLogtimeJson)) {
    addLogToAgent(agentUsername, agentLogs);
  }
};
