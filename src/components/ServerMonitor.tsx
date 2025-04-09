
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, RefreshCw, Clock, AlertTriangle, Server, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ServerMonitorProps {
  config: {
    appKey?: string;
    appSecret?: string;
    consumerKey?: string;
    endpoint?: string;
    telegramToken?: string;
    telegramChatId?: string;
    identifier: string; 
    zone?: string;
    targetPlanCode: string; 
    targetOS?: string;
    targetDuration?: string;
    datacenter?: string;
    checkInterval: number; 
    autoCheckout: boolean; 
  };
  status: any;
  onStop: () => void;
}

const ServerMonitor: React.FC<ServerMonitorProps> = ({ config, status, onStop }) => {
  const [monitorData, setMonitorData] = useState<any>({
    isAvailable: false,
    lastChecked: new Date(),
    checkCount: 0,
    logs: []
  });
  const [nextCheckProgress, setNextCheckProgress] = useState(0);

  // 轮询获取状态更新
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/ovh/status');
        if (response.ok) {
          const data = await response.json();
          setMonitorData(data);
          
          // 如果服务器变为可用，显示通知
          if (data.isAvailable && !monitorData.isAvailable) {
            toast({
              title: "服务器可用！",
              description: `服务器 ${config.targetPlanCode} 现在可用。`,
              variant: "default",
            });
          }
        }
      } catch (error) {
        console.error("获取状态失败:", error);
      }
    };

    // 立即获取一次状态
    fetchStatus();
    
    // 设置轮询间隔
    const interval = setInterval(fetchStatus, 5000); // 每5秒轮询一次
    
    // 设置进度条更新
    const progressInterval = setInterval(() => {
      setNextCheckProgress((prev) => {
        const newProgress = prev + (100 / (config.checkInterval / 2));
        return newProgress > 100 ? 0 : newProgress;
      });
    }, 500); // 每0.5秒更新一次进度条
    
    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [config.targetPlanCode, config.checkInterval, monitorData.isAvailable]);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString('zh-CN');
  };

  const handleManualPurchase = async () => {
    try {
      const response = await fetch('/api/ovh/purchase', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '启动购买失败');
      }

      const result = await response.json();
      toast({
        title: "已启动购买",
        description: `订单流程已开始。查看日志获取详情。`,
      });
    } catch (error) {
      toast({
        title: "购买失败",
        description: error instanceof Error ? error.message : "启动购买失败",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-t-4 border-t-blue-500">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Activity className="h-5 w-5 text-blue-500" />
              服务器监控状态
            </CardTitle>
            <CardDescription>
              每 {config.checkInterval} 秒监控 {config.targetPlanCode} 
            </CardDescription>
          </div>
          <Badge 
            variant={monitorData.isAvailable ? "default" : "outline"}
            className={`text-sm px-3 py-1 ${monitorData.isAvailable ? "bg-green-500 hover:bg-green-600" : ""}`}
          >
            {monitorData.isAvailable ? (
              <><CheckCircle className="h-4 w-4 mr-1" /> 可用</>
            ) : (
              <><XCircle className="h-4 w-4 mr-1" /> 不可用</>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-4 bg-gray-50">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Clock className="mr-2 h-4 w-4" />
              上次检查时间
            </div>
            <div className="text-sm font-medium">
              {formatDate(monitorData.lastChecked || new Date())}
            </div>
          </div>
          <div className="border rounded-md p-4 bg-gray-50">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <RefreshCw className="mr-2 h-4 w-4" />
              检查总次数
            </div>
            <div className="text-sm font-medium">
              {monitorData.checkCount || 0}
            </div>
          </div>
          <div className="border rounded-md p-4 bg-gray-50">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <AlertTriangle className="mr-2 h-4 w-4" />
              自动购买
            </div>
            <div className="text-sm font-medium">
              {config.autoCheckout ? '已启用' : '已禁用'}
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-md bg-blue-50">
          <h3 className="text-sm font-medium mb-2 text-blue-700 flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            下次检查倒计时
          </h3>
          <Progress value={nextCheckProgress} className="h-2 mb-2" />
          <div className="text-xs text-gray-500 text-right">
            约 {Math.ceil((100 - nextCheckProgress) * config.checkInterval / 100)} 秒后检查
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-3 flex items-center text-gray-700">
            <Server className="mr-2 h-4 w-4" />
            活动日志
          </h3>
          <div className="border rounded-md p-4 max-h-64 overflow-y-auto bg-gray-50">
            {monitorData.logs && monitorData.logs.length > 0 ? (
              <div className="space-y-1">
                {monitorData.logs.map((log: any, index: number) => (
                  <div key={index} className="text-sm">
                    <span className="text-gray-500 text-xs">{formatDate(log.timestamp)}</span>: 
                    <span className={
                      log.message.includes('可用') ? 'text-green-600 font-medium' : 
                      log.message.includes('错误') ? 'text-red-600' : 'text-gray-700'
                    }> {log.message}</span>
                    {index < monitorData.logs.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">尚无活动记录。</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <Button variant="outline" onClick={onStop} className="gap-2">
          <XCircle className="h-4 w-4" />
          停止监控
        </Button>
        <Button 
          onClick={handleManualPurchase}
          disabled={!monitorData.isAvailable}
          className={`gap-2 ${monitorData.isAvailable ? "bg-green-500 hover:bg-green-600" : ""}`}
        >
          <CheckCircle className="h-4 w-4" />
          立即购买
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServerMonitor;
