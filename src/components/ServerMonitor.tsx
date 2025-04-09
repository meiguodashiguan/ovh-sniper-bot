
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, RefreshCw, Clock, AlertTriangle } from 'lucide-react';

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

  // Poll for status updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/ovh/status');
        if (response.ok) {
          const data = await response.json();
          setMonitorData(data);
          
          // If server becomes available, show a toast notification
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
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [config.targetPlanCode, monitorData.isAvailable]);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString();
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>服务器监控状态</CardTitle>
            <CardDescription>
              每 {config.checkInterval} 秒监控 {config.targetPlanCode} 
            </CardDescription>
          </div>
          <Badge 
            variant={monitorData.isAvailable ? "default" : "outline"}
            className={monitorData.isAvailable ? "bg-green-500" : ""}
          >
            {monitorData.isAvailable ? (
              <><CheckCircle className="h-4 w-4 mr-1" /> 可用</>
            ) : (
              <><XCircle className="h-4 w-4 mr-1" /> 不可用</>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-3">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Clock className="mr-2 h-4 w-4" />
              上次检查时间
            </div>
            <div className="text-sm font-medium">
              {formatDate(monitorData.lastChecked || new Date())}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <RefreshCw className="mr-2 h-4 w-4" />
              检查总次数
            </div>
            <div className="text-sm font-medium">
              {monitorData.checkCount || 0}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <AlertTriangle className="mr-2 h-4 w-4" />
              自动购买
            </div>
            <div className="text-sm font-medium">
              {config.autoCheckout ? '已启用' : '已禁用'}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">活动日志</h3>
          <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
            {monitorData.logs && monitorData.logs.length > 0 ? (
              <div className="space-y-2">
                {monitorData.logs.map((log: any, index: number) => (
                  <div key={index} className="text-sm">
                    <span className="text-gray-500">{formatDate(log.timestamp)}</span>: {log.message}
                    {index < monitorData.logs.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">尚无活动记录。</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onStop}>
          停止监控
        </Button>
        <Button 
          onClick={handleManualPurchase}
          disabled={!monitorData.isAvailable}
          className={monitorData.isAvailable ? "bg-green-500 hover:bg-green-600" : ""}
        >
          立即购买
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServerMonitor;
