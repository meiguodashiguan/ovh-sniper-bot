
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, RefreshCw, Clock, AlertTriangle } from 'lucide-react';

// Update the type definition to match what's being passed from ServerSniperForm
interface ServerMonitorProps {
  config: {
    appKey?: string;
    appSecret?: string;
    consumerKey?: string;
    endpoint?: string;
    telegramToken?: string;
    telegramChatId?: string;
    identifier: string; // Required
    zone?: string;
    targetPlanCode: string; // Required
    targetOS?: string;
    targetDuration?: string;
    datacenter?: string;
    checkInterval: number; // Required
    autoCheckout: boolean; // Required
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
              title: "Server Available!",
              description: `The server ${config.targetPlanCode} is now available.`,
              variant: "default",
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch status:", error);
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
        throw new Error(error.message || 'Failed to initiate purchase');
      }

      const result = await response.json();
      toast({
        title: "Purchase Initiated",
        description: `Order process started. Check logs for details.`,
      });
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Failed to initiate purchase",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Server Monitoring Status</CardTitle>
            <CardDescription>
              Monitoring {config.targetPlanCode} every {config.checkInterval} seconds
            </CardDescription>
          </div>
          <Badge 
            variant={monitorData.isAvailable ? "default" : "outline"}
            className={monitorData.isAvailable ? "bg-green-500" : ""}
          >
            {monitorData.isAvailable ? (
              <><CheckCircle className="h-4 w-4 mr-1" /> Available</>
            ) : (
              <><XCircle className="h-4 w-4 mr-1" /> Unavailable</>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-3">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Clock className="mr-2 h-4 w-4" />
              Last Checked
            </div>
            <div className="text-sm font-medium">
              {formatDate(monitorData.lastChecked || new Date())}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <RefreshCw className="mr-2 h-4 w-4" />
              Total Checks
            </div>
            <div className="text-sm font-medium">
              {monitorData.checkCount || 0}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Auto Checkout
            </div>
            <div className="text-sm font-medium">
              {config.autoCheckout ? 'Enabled' : 'Disabled'}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Activity Log</h3>
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
              <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onStop}>
          Stop Monitoring
        </Button>
        <Button 
          onClick={handleManualPurchase}
          disabled={!monitorData.isAvailable}
          className={monitorData.isAvailable ? "bg-green-500 hover:bg-green-600" : ""}
        >
          Purchase Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServerMonitor;
