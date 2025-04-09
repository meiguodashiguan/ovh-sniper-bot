
import express from 'express';
import { startMonitoring, stopMonitoring, getMonitoringStatus, purchaseServer } from './ovh/monitor';

const router = express.Router();

// OVH Server Sniper API routes
router.post('/ovh/start-monitoring', startMonitoring);
router.post('/ovh/stop-monitoring', stopMonitoring);
router.get('/ovh/status', getMonitoringStatus);
router.post('/ovh/purchase', purchaseServer);

export default router;
