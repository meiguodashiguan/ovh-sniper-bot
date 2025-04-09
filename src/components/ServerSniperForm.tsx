
import React, { useState, useEffect } from 'react';
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
import { defaultCredentials, OVHCredentials } from '@/config/apiConfig';
import { AlertCircle, Key, Server, Clock, ShieldCheck, Bell } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  identifier: z.string().min(1, "标识符不能为空"),
  zone: z.string().min(1, "区域不能为空"),
  targetPlanCode: z.string().min(1, "目标计划代码不能为空"),
  targetOS: z.string().min(1, "目标操作系统不能为空"),
  targetDuration: z.string().min(1, "目标期限不能为空"),
  datacenter: z.string().optional(),
  checkInterval: z.number().min(30, "检查间隔必须至少30秒").default(360),
  autoCheckout: z.boolean().default(false)
});

type FormData = z.infer<typeof formSchema>;

const ServerSniperForm = () => {
  const [monitoring, setMonitoring] = useState(false);
  const [serverConfig, setServerConfig] = useState<FormData | null>(null);
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("config");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetOS: 'none_64.en',
      targetDuration: 'P1M',
      checkInterval: 360,
      autoCheckout: false,
    },
  });

  // 当监控开始后自动切换到监控选项卡
  useEffect(() => {
    if (monitoring) {
      setActiveTab("monitor");
    }
  }, [monitoring]);

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
        throw new Error(error.message || '启动监控失败');
      }

      setServerConfig(data);
      setMonitoring(true);
      toast({
        title: "监控已启动",
        description: `正在每 ${data.checkInterval} 秒检查 ${data.targetPlanCode} 的可用性。`,
      });
    } catch (error) {
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "启动监控失败",
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
        throw new Error(error.message || '停止监控失败');
      }

      setMonitoring(false);
      setServerStatus(null);
      setActiveTab("config");
      toast({
        title: "监控已停止",
        description: "服务器可用性检查已停止。",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "停止监控失败",
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="config" className="flex items-center gap-2">
          <Key size={16} />
          <span>配置</span>
        </TabsTrigger>
        <TabsTrigger value="monitor" disabled={!monitoring} className="flex items-center gap-2">
          <Server size={16} />
          <span>监控</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="config">
        <Card className="border-t-4 border-t-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Server className="h-5 w-5 text-blue-500" />
              OVH 服务器配置
            </CardTitle>
            <CardDescription>
              配置您的服务器监控偏好。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-medium text-purple-700">
                    <Server className="h-5 w-5" />
                    <h3>服务器配置</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="identifier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>标识符</FormLabel>
                          <FormControl>
                            <Input placeholder="例如：go-ovh-FR" {...field} />
                          </FormControl>
                          <FormDescription>
                            为此监控会话设置的识别标签
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
                          <FormLabel>区域</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="选择区域" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="FR">法国 (FR)</SelectItem>
                                <SelectItem value="GB">英国 (GB)</SelectItem>
                                <SelectItem value="DE">德国 (DE)</SelectItem>
                                <SelectItem value="ES">西班牙 (ES)</SelectItem>
                                <SelectItem value="IT">意大利 (IT)</SelectItem>
                                <SelectItem value="PL">波兰 (PL)</SelectItem>
                                <SelectItem value="PT">葡萄牙 (PT)</SelectItem>
                                <SelectItem value="IE">爱尔兰 (IE)</SelectItem>
                                <SelectItem value="FI">芬兰 (FI)</SelectItem>
                                <SelectItem value="LT">立陶宛 (LT)</SelectItem>
                                <SelectItem value="CZ">捷克共和国 (CZ)</SelectItem>
                                <SelectItem value="NL">荷兰 (NL)</SelectItem>
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
                          <FormLabel>目标计划代码</FormLabel>
                          <FormControl>
                            <Input placeholder="例如：1801sk12" {...field} />
                          </FormControl>
                          <FormDescription>
                            您想要监控的 OVH 服务器计划代码
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
                          <FormLabel>首选数据中心（可选）</FormLabel>
                          <FormControl>
                            <Input placeholder="例如：rbx" {...field} />
                          </FormControl>
                          <FormDescription>
                            留空以接受任何可用的数据中心
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
                          <FormLabel>目标操作系统</FormLabel>
                          <FormControl>
                            <Input placeholder="例如：none_64.en" {...field} />
                          </FormControl>
                          <FormDescription>
                            要安装的操作系统
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
                          <FormLabel>目标期限</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="选择期限" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="P1M">1 个月 (P1M)</SelectItem>
                                <SelectItem value="P3M">3 个月 (P3M)</SelectItem>
                                <SelectItem value="P6M">6 个月 (P6M)</SelectItem>
                                <SelectItem value="P12M">12 个月 (P12M)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-medium text-orange-700">
                    <Clock className="h-5 w-5" />
                    <h3>监控设置</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="checkInterval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>检查间隔（秒）</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={30} 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                            />
                          </FormControl>
                          <FormDescription>
                            多久检查一次服务器可用性（最少30秒）
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
                              自动结账
                            </FormLabel>
                            <FormDescription>
                              服务器可用时自动购买
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

                <div className="flex justify-between items-center pt-4">
                  <div className="flex items-center text-amber-600">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">请确保所有信息准确无误</span>
                  </div>
                  <Button 
                    type="submit" 
                    className={monitoring ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"}
                  >
                    {monitoring ? "停止监控" : "开始监控"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="monitor">
        {serverConfig && (
          <ServerMonitor 
            config={{
              ...serverConfig,
              // 确保所需属性一定存在
              identifier: serverConfig.identifier || '',
              targetPlanCode: serverConfig.targetPlanCode || '',
              checkInterval: serverConfig.checkInterval || 360,
              autoCheckout: serverConfig.autoCheckout || false
            }} 
            status={serverStatus} 
            onStop={stopMonitoring} 
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ServerSniperForm;
