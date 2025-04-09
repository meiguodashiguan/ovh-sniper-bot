import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import ServerMonitor from './ServerMonitor';

const formSchema = z.object({
  appKey: z.string().min(1, "OVH App Key is required"),
  appSecret: z.string().min(1, "OVH App Secret is required"),
  consumerKey: z.string().min(1, "OVH Consumer Key is required"),
  endpoint: z.string().min(1, "Endpoint is required"),
  telegramToken: z.string().min(1, "Telegram Bot Token is required"),
  telegramChatId: z.string().min(1, "Telegram Chat ID is required"),
  identifier: z.string().min(1, "Identifier is required"),
  zone: z.string().min(1, "Zone is required"),
  targetPlanCode: z.string().min(1, "Target Plan Code is required"),
  targetOS: z.string().min(1, "Target OS is required"),
  targetDuration: z.string().min(1, "Target Duration is required"),
  datacenter: z.string().optional(),
  checkInterval: z.number().min(30, "Interval must be at least 30 seconds").default(360),
  autoCheckout: z.boolean().default(false)
});

type FormData = z.infer<typeof formSchema>;

const ServerSniperForm = () => {
  const [monitoring, setMonitoring] = useState(false);
  const [serverConfig, setServerConfig] = useState<FormData | null>(null);
  const [serverStatus, setServerStatus] = useState<any>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endpoint: 'ovh-eu',
      targetOS: 'none_64.en',
      targetDuration: 'P1M',
      checkInterval: 360,
      autoCheckout: false,
    },
  });

  const startMonitoring = async (data: FormData) => {
    try {
      const response = await fetch('/api/ovh/start-monitoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to start monitoring');
      }

      setServerConfig(data);
      setMonitoring(true);
      toast({
        title: "Monitoring Started",
        description: `Checking for ${data.targetPlanCode} availability every ${data.checkInterval} seconds.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start monitoring",
        variant: "destructive",
      });
    }
  };

  const stopMonitoring = async () => {
    try {
      const response = await fetch('/api/ovh/stop-monitoring', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to stop monitoring');
      }

      setMonitoring(false);
      setServerStatus(null);
      toast({
        title: "Monitoring Stopped",
        description: "Server availability check has been stopped.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to stop monitoring",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: FormData) => {
    if (monitoring) {
      stopMonitoring();
    } else {
      startMonitoring(data);
    }
  };

  return (
    <Tabs defaultValue="config" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="config">Configuration</TabsTrigger>
        <TabsTrigger value="monitor" disabled={!monitoring}>Monitoring</TabsTrigger>
      </TabsList>
      
      <TabsContent value="config">
        <Card>
          <CardHeader>
            <CardTitle>OVH Server Configuration</CardTitle>
            <CardDescription>
              Enter your OVH API credentials and server preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">API Credentials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="appKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OVH App Key</FormLabel>
                          <FormControl>
                            <Input placeholder="OVH App Key" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="appSecret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OVH App Secret</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="OVH App Secret" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="consumerKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OVH Consumer Key</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="OVH Consumer Key" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endpoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OVH Endpoint</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select endpoint" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ovh-eu">OVH Europe (ovh-eu)</SelectItem>
                                <SelectItem value="ovh-us">OVH US (ovh-us)</SelectItem>
                                <SelectItem value="ovh-ca">OVH Canada (ovh-ca)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="telegramToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telegram Bot Token</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Telegram Bot Token" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="telegramChatId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telegram Chat ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Telegram Chat ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Server Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="identifier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Identifier</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., go-ovh-FR" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your identification tag for this monitoring session
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zone</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select zone" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="FR">France (FR)</SelectItem>
                                <SelectItem value="GB">Great Britain (GB)</SelectItem>
                                <SelectItem value="DE">Germany (DE)</SelectItem>
                                <SelectItem value="ES">Spain (ES)</SelectItem>
                                <SelectItem value="IT">Italy (IT)</SelectItem>
                                <SelectItem value="PL">Poland (PL)</SelectItem>
                                <SelectItem value="PT">Portugal (PT)</SelectItem>
                                <SelectItem value="IE">Ireland (IE)</SelectItem>
                                <SelectItem value="FI">Finland (FI)</SelectItem>
                                <SelectItem value="LT">Lithuania (LT)</SelectItem>
                                <SelectItem value="CZ">Czech Republic (CZ)</SelectItem>
                                <SelectItem value="NL">Netherlands (NL)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="targetPlanCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Plan Code</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 1801sk12" {...field} />
                          </FormControl>
                          <FormDescription>
                            The OVH server plan code you want to monitor
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="datacenter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Datacenter (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., rbx" {...field} />
                          </FormControl>
                          <FormDescription>
                            Leave empty to accept any available datacenter
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="targetOS"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target OS</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., none_64.en" {...field} />
                          </FormControl>
                          <FormDescription>
                            The operating system to install
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="targetDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Duration</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="P1M">1 Month (P1M)</SelectItem>
                                <SelectItem value="P3M">3 Months (P3M)</SelectItem>
                                <SelectItem value="P6M">6 Months (P6M)</SelectItem>
                                <SelectItem value="P12M">12 Months (P12M)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Monitoring Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="checkInterval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Check Interval (seconds)</FormLabel>
                          <FormControl>
                            <Input type="number" min={30} {...field} />
                          </FormControl>
                          <FormDescription>
                            How often to check for server availability (min 30 seconds)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="autoCheckout"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Auto Checkout
                            </FormLabel>
                            <FormDescription>
                              Automatically purchase when server is available
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <CardFooter className="px-0 pt-4">
                  <Button 
                    type="submit" 
                    className={monitoring ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    {monitoring ? "Stop Monitoring" : "Start Monitoring"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="monitor">
        {serverConfig && <ServerMonitor config={serverConfig} status={serverStatus} onStop={stopMonitoring} />}
      </TabsContent>
    </Tabs>
  );
};

export default ServerSniperForm;
