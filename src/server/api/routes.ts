
import express from 'express';
import { startMonitoring, stopMonitoring, getMonitoringStatus, purchaseServer } from './ovh/monitor';

const router = express.Router();

// OVH服务器监控API路由
router.post('/ovh/start-monitoring', startMonitoring);  // 开始监控服务器可用性
router.post('/ovh/stop-monitoring', stopMonitoring);    // 停止监控服务器可用性
router.get('/ovh/status', getMonitoringStatus);         // 获取当前监控状态
router.post('/ovh/purchase', purchaseServer);           // 购买服务器

export default router;
