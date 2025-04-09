
import React from 'react';
import ServerSniperForm from '@/components/ServerSniperForm';
import { Toaster } from '@/components/ui/toaster';
import { Server, Bell, ShoppingCart } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-500 rounded-full text-white">
              <Server size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">OVH 服务器监控抢购系统</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">监控 OVH 服务器并在服务器可用时自动购买</p>
        </header>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg flex items-center">
                <div className="p-2 bg-blue-100 rounded-full mr-3">
                  <Server className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">实时监控</h3>
                  <p className="text-sm text-blue-700">监控服务器可用性</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg flex items-center">
                <div className="p-2 bg-green-100 rounded-full mr-3">
                  <Bell className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-green-900">即时通知</h3>
                  <p className="text-sm text-green-700">通过Telegram接收提醒</p>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg flex items-center">
                <div className="p-2 bg-purple-100 rounded-full mr-3">
                  <ShoppingCart className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-purple-900">自动购买</h3>
                  <p className="text-sm text-purple-700">一键完成服务器抢购</p>
                </div>
              </div>
            </div>
            
            <ServerSniperForm />
          </div>
        </div>
        
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>OVH 服务器监控抢购系统 &copy; {new Date().getFullYear()}</p>
          <p className="text-xs mt-1">使用安全、高效的方式监控和抢购OVH服务器</p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
