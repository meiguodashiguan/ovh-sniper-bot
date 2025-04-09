
import React from 'react';
import ServerSniperForm from '@/components/ServerSniperForm';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">OVH 服务器监控抢购系统</h1>
          <p className="text-gray-600">监控 OVH 服务器并在服务器可用时自动购买</p>
        </header>
        
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <ServerSniperForm />
        </div>
        
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>OVH 服务器监控抢购系统 &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
