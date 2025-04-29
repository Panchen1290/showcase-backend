import { Router } from 'express';
import {
  uploadAgentPerformanceReport,
  uploadLogtimeReport,
} from '../controllers/reportController';
import fileUpload from 'express-fileupload';

const router = Router();
router.use(fileUpload());

router.post('/uploadAgentPerformance', uploadAgentPerformanceReport);
router.post('/uploadLogtime', uploadLogtimeReport);

export default router;
